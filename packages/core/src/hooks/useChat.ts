import type { ActionSequence, TestCase, TestStep } from '@/shared/automationTypes';
import { TestCaseExecutor } from '@/shared/factory/TestCaseExecutor';
import { AIClient } from '@/shared/factory/AIClient';
import { AIConfigManager, ModelType } from '@/shared/factory/AIConfig';
import { globalSessionManager } from '@/shared/factory/SessionManager';
import { useState, useEffect, useRef, useCallback } from 'react';
import { nanoid } from 'nanoid';
import type { ChatMessage } from '@/shared/types/chatTypes';
import { generateTestCode } from '@/shared/smartApi';
import { overrideAIConfig } from '@midscene/shared/env';

export interface UseChatOptions {
  onTestCaseUpdate?: (testCase: TestCase) => void;
  onStepUpdate?: (step: TestStep) => void;
}

/**
 * Chat state for useChat hook
 */
export interface ChatState {
  messages: ChatMessage[];
  isGenerating: boolean;
  isExecuting: boolean;
  error: string | null;
  stopGenerating: () => void;
  sendMessage: (content: string) => Promise<void>;
  onSessionChange: (sessionId?: string) => void;
  reset: () => void;
  sessionId: () => string;
  updateStep: (step: TestStep) => void;
}

export const useChat = ({ onTestCaseUpdate, onStepUpdate }: UseChatOptions = {}): ChatState => {
  const sessionId = useRef<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const executorRef = useRef<TestCaseExecutor | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const aiClientRef = useRef<AIClient | null>(null);
  const configManagerRef = useRef<AIConfigManager | null>(null);

  // Initialize AI client
  const initializeAIClient = useCallback(async () => {
    configManagerRef.current = new AIConfigManager();
    await configManagerRef.current.initialize();

    const defaultConfig = configManagerRef.current.getEnabledConfigByType(ModelType.LANGUAGE);

    const visionConfig = configManagerRef.current.getEnabledConfigByType(ModelType.VISION);
    if (visionConfig) {
      overrideAIConfig({
        OPENAI_BASE_URL: visionConfig.baseURL,
        OPENAI_API_KEY: visionConfig.apiKey,
        MIDSCENE_MODEL_NAME: visionConfig.model,
        // only support use doubao vision
        MIDSCENE_USE_DOUBAO_VISION: '1',
      });
    }

    if (defaultConfig) {
      aiClientRef.current = new AIClient(configManagerRef.current);
    }
  }, []);

  // Cleanup resources
  const cleanup = useCallback(() => {
    if (executorRef.current) {
      executorRef.current.destroy();
      executorRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Stop generating
  const stopGenerating = useCallback(() => {
    cleanup();
    setIsGenerating(false);
    setIsExecuting(false);
  }, [cleanup]);

  const updateMessage = useCallback((id: string, update: Partial<ChatMessage>) => {
    setMessages(prev => {
      const newMessages = prev.map(msg => (msg.id === id ? { ...msg, ...update } : msg));
      updateSessionMessages(newMessages, false);
      return newMessages;
    });
  }, []);

  const updateSessionMessages = useCallback((messages: ChatMessage[], isAppend = false) => {
    if (sessionId.current) {
      globalSessionManager.updateSessionMessages(sessionId.current, messages, isAppend);
    }
  }, []);

  const onSessionChange = useCallback((newSessionId?: string) => {
    if (newSessionId) {
      sessionId.current = newSessionId;
      const session = globalSessionManager.getSession(newSessionId);
      setMessages(session?.messages || []);
    } else {
      sessionId.current = null;
      setMessages([]);
    }
  }, []);

  const updateStep = useCallback((step: TestStep) => {
    setMessages(prev => {
      const newMessages = prev.map(msg => {
        if (msg.type === 'assistant' && msg.testCase?.steps.some(s => s.id === step.id)) {
          return {
            ...msg,
            testCase: {
              ...msg.testCase,
              steps: msg.testCase?.steps.map(s => (s.id === step.id ? step : s)) || [],
            } as TestCase,
          };
        }
        return msg;
      });
      return newMessages;
    });
  }, []);

  // Send message and execute test
  const sendMessage = useCallback(
    async (content: string) => {
      await initializeAIClient();

      // Create user message
      const userMessage: ChatMessage = {
        id: nanoid(),
        type: 'user',
        content,
        timestamp: Date.now(),
      };

      // Create assistant message (placeholder)
      const assistantMessage: ChatMessage = {
        id: nanoid(),
        type: 'assistant',
        progressInfo: 'Analyzing test requirements...',
        content: '',
        timestamp: Date.now(),
        isThinking: true,
        isGenerating: true,
      };

      setMessages(prev => {
        const newMessages = [...prev, userMessage, assistantMessage];
        updateSessionMessages(newMessages, false);
        return newMessages;
      });

      setIsGenerating(true);
      setIsExecuting(true);
      setError(null);

      try {
        // Clean up previous executor
        cleanup();

        let testCode = '';
        const reasoningSteps: string[] = [];
        let actionSequence: ActionSequence | undefined;

        if (!aiClientRef.current) {
          // @NOTE: ai client not initialized because no custom model configuration, call smart api directly to complete generation
          updateMessage(assistantMessage.id, {
            progressInfo: `Generating test code...`,
            content: '',
            isThinking: false,
          });

          actionSequence = await generateTestCode({
            request: content,
          });

          updateMessage(assistantMessage.id, {
            progressInfo: 'Analysis complete, preparing to execute test...',
            isThinking: false,
          });
        } else {
          // Use AI client for streaming analysis
          await new Promise<void>((resolve, reject) => {
            aiClientRef.current!.generateTestCodeStream(content, {
              onChunk: chunk => {
                testCode += chunk;
                updateMessage(assistantMessage.id, {
                  progressInfo: `Generating test code...`,
                  content: chunk,
                  isThinking: false,
                });
              },
              onReasoning: reasoning => {
                reasoningSteps.push(reasoning);
                updateMessage(assistantMessage.id, {
                  progressInfo: `Analyzing test requirements...`,
                  reasoning: reasoningSteps,
                });
              },
              onComplete: () => {
                updateMessage(assistantMessage.id, {
                  progressInfo: 'Analysis complete, preparing to execute test...',
                  isThinking: false,
                });
                resolve();
              },
              onError: error => {
                reject(new Error(error));
              },
            });
          });

          if (!testCode.trim()) {
            throw new Error('Failed to generate valid test code');
          }
        }

        const executor = new TestCaseExecutor({
          name: 'Automated Test Case',
          userInput: content,
          code: testCode,
          actionSequence,
        });

        executorRef.current = executor;
        console.log('executor', executor);

        // Listen for status changes
        executor.on('caseStatusChanged', ({ testCase }) => {
          onTestCaseUpdate?.(testCase);

          // Update assistant message
          updateMessage(assistantMessage.id, {
            testCase,
            progressInfo: getStatusMessage(testCase.status),
            content: testCase.error || '',
          });
        });

        executor.on('stepStarted', ({ step }) => {
          updateStep(step);
          onStepUpdate?.(step);
        });

        executor.on('stepCompleted', ({ step }) => {
          updateStep(step);
          onStepUpdate?.(step);
        });

        executor.on('caseParsed', ({ testCase }) => {
          updateMessage(assistantMessage.id, {
            progressInfo: `Parsing complete, total ${testCase.steps.length} steps`,
            reasoning: reasoningSteps,
          });
        });

        // Parse test code
        await executor.parse();

        const result = await executor.execute();

        // Update final status
        updateMessage(assistantMessage.id, {
          progressInfo: getExecutionResultMessage(result),
          isExecuting: false,
          testCase: result,
          reasoning: reasoningSteps,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Execution failed';
        setError(errorMessage);
        updateMessage(assistantMessage.id, {
          progressInfo: `Execution failed: ${errorMessage}`,
          isExecuting: false,
          isThinking: false,
          isGenerating: false,
        });
      } finally {
        setIsGenerating(false);
        setIsExecuting(false);
      }
    },
    [cleanup, initializeAIClient, onTestCaseUpdate, onStepUpdate],
  );

  // Enhanced reset with session handling
  const resetWithSession = useCallback(() => {
    cleanup();
    setMessages([]);
    setError(null);
    setIsGenerating(false);
    setIsExecuting(false);
  }, [cleanup]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  return {
    messages,
    isGenerating,
    isExecuting,
    error,
    stopGenerating,
    sendMessage,
    onSessionChange,
    sessionId: () => sessionId.current ?? '',
    reset: resetWithSession,
    updateStep,
  };
};

// Helper function: get status message
function getStatusMessage(status: string): string {
  const statusMap: Record<string, string> = {
    created: 'Ready to execute...',
    running: 'Executing test...',
    completed: 'Test execution complete',
    failed: 'Test execution failed',
  };
  return statusMap[status] || 'Processing...';
}

// Helper function: get execution result message
function getExecutionResultMessage(testCase: TestCase): string {
  if (testCase.status === 'completed') {
    const successSteps = testCase.steps.filter(s => s.status === 'success').length;
    const totalSteps = testCase.steps.length;
    return `Execution complete: ${successSteps}/${totalSteps} steps successful`;
  } else {
    const failedSteps = testCase.steps.filter(s => s.status === 'failed').length;
    return `Execution failed: ${failedSteps} steps failed`;
  }
}
