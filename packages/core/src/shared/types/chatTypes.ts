import type { TestCase } from '../automationTypes';

/**
 * Chat message type used in chat sessions
 */
export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  /**
   * When type is user, content is the message content
   *
   * When type is assistant, content is the model analysis output
   */
  content: string;
  /**
   * Information during execution, such as execution steps, error information, etc.
   */
  progressInfo?: string;
  reasoning?: string[];
  testCase?: TestCase;
  timestamp: number;
  /**
   * Whether thinking
   */
  isThinking?: boolean;
  /**
   * Whether generating test code
   */
  isGenerating?: boolean;
  /**
   * Whether executing test
   */
  isExecuting?: boolean;
}

/**
 * Chat session containing multiple chat messages
 */
export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  metadata?: {
    totalMessages?: number;
    lastMessagePreview?: string;
    testCasesCount?: number;
  };
}
