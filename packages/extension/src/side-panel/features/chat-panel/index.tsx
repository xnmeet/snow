import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ScrollArea,
  Button,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@snow/core/ui';
import { PromptInputBox } from '@snow/core/components';
import { useChat, useScrollToBottom } from '@snow/core/hooks';
import type { TestStep } from '@snow/core/shared';
import { globalSessionManager, ModelType, globalAIConfigManager } from '@snow/core/shared';

import { useState, useEffect } from 'react';
import { History, Plus } from 'lucide-react';
import { SessionDrawer } from '../../components/SessionDrawer';

import { TestStepItem } from '../../components/TestStepItem';
import { ThinkingMessage } from '../../components/ThinkingMessage';
import { TabInfo } from '../../components/TabInfo';
import { MessageWrapper } from '../../components/MessageWrapper';
import { CodeDisplay } from '../../components/CodeDisplay';
import { Settings } from '../../components/Settings';
import { VisionModelGuidance } from '../../components/VisionModelGuidance';

export const ChatPanel = () => {
  const [isSessionDrawerOpen, setIsSessionDrawerOpen] = useState(false);
  const [availableModels, setAvailableModels] = useState<
    Array<{ id: string; name: string; type: 'language' | 'vision' }>
  >([]);
  const [selectedModel, setSelectedModel] = useState<string | undefined>(undefined);
  const [showVisionGuidance, setShowVisionGuidance] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const { scrollRef, scrollToBottom } = useScrollToBottom();
  const { messages, sendMessage, isExecuting, onSessionChange, sessionId, updateStep } = useChat();

  const handleSendMessage = async (message: string) => {
    if (!sessionId()) {
      const session = globalSessionManager.createSession();
      session.title = message;
      onSessionChange(session.id);
    }

    // Here you could use the modelId to configure which model to use
    // For now, we'll just pass it along or use the default behavior
    await sendMessage(message);
  };

  const handleSessionChange = (sessionId: string) => {
    onSessionChange(sessionId);
  };

  const handleSkipStep = (step: TestStep) => {
    updateStep({ ...step, status: 'skipped' });
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    globalAIConfigManager.updateConfig(modelId, { isEnabled: true });
  };

  const handleCreateSession = () => {
    if (!sessionId()) {
      return;
    }

    onSessionChange();
  };

  const checkVisionModelConfig = () => {
    const visionConfigs = globalAIConfigManager.getVisionConfigs();
    const hasEnabledVisionModel = visionConfigs.some(config => config.isEnabled);
    setShowVisionGuidance(!hasEnabledVisionModel && visionConfigs.length === 0);
  };

  const loadModels = async () => {
    const configs = globalAIConfigManager.getAllConfigs();
    const models = configs
      .filter(config => config.modelType === ModelType.LANGUAGE)
      .map(config => ({
        id: config.id,
        name: config.name,
        type: config.modelType as 'language' | 'vision',
      }));

    setAvailableModels(models);

    const defaultConfig = globalAIConfigManager.getEnabledConfigByType(ModelType.LANGUAGE);
    setSelectedModel(defaultConfig?.id);

    // Check vision model configuration
    checkVisionModelConfig();
  };

  useEffect(() => {
    loadModels();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'settings') {
      setShowVisionGuidance(false); // Hide guidance when navigating to settings
    }
  };

  const handleNavigateToSettings = () => {
    setActiveTab('settings');
    setShowVisionGuidance(false);
  };

  return (
    <div className="flex flex-col h-full">
      <TabInfo autoUpdate={true} enableErrorHandling={true} />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full flex-1 overflow-hidden">
        <div className="p-2 flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCreateSession}
                  className="h-8 px-3 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create a new session</p>
              </TooltipContent>
            </Tooltip>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSessionDrawerOpen(true)}
              className="h-8 px-3 cursor-pointer"
            >
              <History className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="chat" className="flex flex-col overflow-hidden justify-between gap-3">
          {showVisionGuidance && <VisionModelGuidance onNavigateToSettings={handleNavigateToSettings} />}

          <div className="flex flex-col gap-4 overflow-hidden">
            <ScrollArea className="h-full p-2" ref={scrollRef}>
              <div className="flex flex-col gap-3">
                {messages.map(message => (
                  <div key={message.id} className="flex flex-col gap-2">
                    <div className="text-xs text-gray-500">
                      {message.type === 'user' ? (
                        <MessageWrapper className="bg-primary text-primary-foreground float-right">
                          {message.content}
                        </MessageWrapper>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <MessageWrapper className="bg-muted">{message.progressInfo}</MessageWrapper>
                          <div className="max-w-[75%]">
                            <ThinkingMessage
                              content={message.reasoning?.join('') || ''}
                              isStreaming={message.isThinking}
                            />
                            <div className="flex flex-col gap-1 mt-1">
                              {message.testCase?.steps?.map(step => (
                                <TestStepItem key={step.id} step={step} onSkip={handleSkipStep} />
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="p-3">
            <PromptInputBox
              onSend={handleSendMessage}
              isLoading={isExecuting}
              availableModels={availableModels}
              selectedModel={selectedModel}
              onModelChange={handleModelChange}
            />
          </div>
        </TabsContent>

        <TabsContent value="code" className="flex flex-col overflow-hidden gap-3">
          <div className="flex-1 p-2 overflow-hidden">
            <CodeDisplay
              steps={messages.flatMap(message => message.testCase?.steps).filter(Boolean) as TestStep[]}
            />
          </div>
        </TabsContent>

        <TabsContent value="settings" className="flex flex-col overflow-hidden gap-3">
          <Settings onConfigRefresh={loadModels} />
        </TabsContent>
      </Tabs>

      <SessionDrawer
        open={isSessionDrawerOpen}
        onOpenChange={setIsSessionDrawerOpen}
        onSessionSelect={handleSessionChange}
        currentSessionId={sessionId()}
      />
    </div>
  );
};
