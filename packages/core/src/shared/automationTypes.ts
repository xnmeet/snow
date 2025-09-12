// Re-export Zod-defined types, maintaining backward compatibility
export type {
  AIActionType,
  ScrollType,
  ScrollDirection,
  KeyboardKey,
  DomIncludeOption,
  Point,
  ScrollParam,
  LocateOption,
  AndroidDeviceInputOpt,
  InsightExtractOption,
  AgentAssertOpt,
  AgentWaitForOpt,
  LocatorValidatorOption,
} from './schemas';

// Re-export Zod-defined core types
export type {
  AIAction,
  TestStep,
  ActionSequence,
  TestCase,
  ExecutionSession,
  AutomationAgentOptions,
  TestStepStatus,
  TestCaseStatus,
} from './schemas';

// Execution result type
export type ExecutionResult = string | boolean | number | Record<string, any> | Array<any> | null;
