export { AIClient } from './factory/AIClient';
export { type AIConfig, AIConfigManager, ModelType, globalAIConfigManager } from './factory/AIConfig';
export { AutomationAgent } from './factory/AutomationAgent';
export type {
  AIAction,
  AIActionType,
  ActionSequence,
  TestStep,
  TestCase,
  ExecutionSession,
} from './automationTypes';
export { getStorage, setStorage } from './messageHandler';
export { PromptManager, type PromptScenario, type PromptTemplate } from './factory/PromptManager';
export { TestCaseExecutor } from './factory/TestCaseExecutor';
export { SessionManager, globalSessionManager } from './factory/SessionManager';
export { IndexedDBStorage } from './storage/IndexedDBStorage';
export type {
  ChatMessage,
  ChatSession,
} from './types/chatTypes';
