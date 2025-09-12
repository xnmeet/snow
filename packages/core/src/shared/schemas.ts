import { z } from 'zod';

// ============================================================================
// Basic Types Definition
// ============================================================================

// Coordinate point
export const PointSchema = z.object({
  x: z.number(),
  y: z.number(),
});
export type Point = z.infer<typeof PointSchema>;

// Scroll direction
export const ScrollDirectionSchema = z.enum(['up', 'down', 'left', 'right']);
export type ScrollDirection = z.infer<typeof ScrollDirectionSchema>;

// Scroll type
export const ScrollTypeSchema = z.enum(['once', 'untilBottom', 'untilTop', 'untilLeft', 'untilRight']);
export type ScrollType = z.infer<typeof ScrollTypeSchema>;

// DOM include option
export const DomIncludeOptionSchema = z.union([z.boolean(), z.literal('visible-only')]);
export type DomIncludeOption = z.infer<typeof DomIncludeOptionSchema>;

// Keyboard key type
export const KeyboardKeySchema = z.union([
  z.enum([
    'Enter',
    'Tab',
    'Escape',
    'Backspace',
    'Delete',
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
  ]),
  z.string(),
]);
export type KeyboardKey = z.infer<typeof KeyboardKeySchema>;

// Test step status
export const TestStepStatusSchema = z.enum(['pending', 'running', 'success', 'failed', 'skipped']);
export type TestStepStatus = z.infer<typeof TestStepStatusSchema>;

// Test case status
export const TestCaseStatusSchema = z.enum(['created', 'running', 'completed', 'failed', 'stopped']);
export type TestCaseStatus = z.infer<typeof TestCaseStatusSchema>;

// AI action type
export const AIActionTypeSchema = z.enum([
  // AI auto-planning and execution
  'ai',
  'aiAction',
  // Interaction actions
  'aiTap',
  'aiInput',
  'aiHover',
  'aiKeyboardPress',
  'aiScroll',
  'aiRightClick',
  'aiDoubleClick',
  // Element location and validation
  'aiLocate',
  'aiWaitFor',
  'aiAssert',
  // Data extraction and query
  'aiQuery',
  'aiExtract',
  'aiAsk',
  'aiBoolean',
  'aiNumber',
  'aiString',
  // Advanced features
  'runYaml',
  'evaluateJavaScript',
  'logScreenshot',
  'describeElementAtPoint',
  'verifyLocator',
  'freezePageContext',
  'unfreezePageContext',
  'setAIActionContext',
]);
export type AIActionType = z.infer<typeof AIActionTypeSchema>;

// ============================================================================
// Options Types Definition - Categorized by Midscene API
// ============================================================================

// Locate option (LocateOption)
export const LocateOptionSchema = z
  .object({
    deepThink: z.boolean().optional(),
    cacheable: z.boolean().optional(),
  })
  .strict();
export type LocateOption = z.infer<typeof LocateOptionSchema>;

// Android device input option (AndroidDeviceInputOpt)
export const AndroidDeviceInputOptSchema = z
  .object({
    autoDismissKeyboard: z.boolean().optional(),
  })
  .strict();
export type AndroidDeviceInputOpt = z.infer<typeof AndroidDeviceInputOptSchema>;

// Scroll parameters (PlanningActionParamScroll)
export const ScrollParamSchema = z
  .object({
    direction: ScrollDirectionSchema,
    scrollType: ScrollTypeSchema,
    distance: z.number().optional(),
  })
  .strict();
export type ScrollParam = z.infer<typeof ScrollParamSchema>;

// Data extraction option (InsightExtractOption)
export const InsightExtractOptionSchema = z
  .object({
    domIncluded: DomIncludeOptionSchema.optional(),
    screenshotIncluded: z.boolean().optional(),
  })
  .strict();
export type InsightExtractOption = z.infer<typeof InsightExtractOptionSchema>;

// Assertion option (AgentAssertOpt)
export const AgentAssertOptSchema = z
  .object({
    timeoutMs: z.number().optional(),
  })
  .strict();
export type AgentAssertOpt = z.infer<typeof AgentAssertOptSchema>;

// Wait option (AgentWaitForOpt)
export const AgentWaitForOptSchema = z
  .object({
    timeoutMs: z.number().optional(),
    checkIntervalMs: z.number().optional(),
  })
  .strict();
export type AgentWaitForOpt = z.infer<typeof AgentWaitForOptSchema>;

// Element location validation option (LocatorValidatorOption)
export const LocatorValidatorOptionSchema = z
  .object({
    verifyPrompt: z.boolean().optional(),
    retryLimit: z.number().optional(),
    deepThink: z.boolean().optional(),
  })
  .strict();
export type LocatorValidatorOption = z.infer<typeof LocatorValidatorOptionSchema>;

// ============================================================================
// Action Parameters Definition - Categorized by Functionality
// ============================================================================

// Basic action parameters
export const BaseActionParamsSchema = z.object({
  type: AIActionTypeSchema,
});

// AI planning action parameters
export const AIPlanningParamsSchema = BaseActionParamsSchema.extend({
  prompt: z.string(),
  cacheable: z.boolean().optional(),
});

// Interaction action parameters
export const InteractionParamsSchema = BaseActionParamsSchema.extend({
  locate: z.string(),
}).extend(LocateOptionSchema.shape);

// Input action parameters
export const InputParamsSchema = InteractionParamsSchema.extend({
  text: z.string(),
}).extend(AndroidDeviceInputOptSchema.shape);

// Keyboard action parameters
export const KeyboardParamsSchema = BaseActionParamsSchema.extend({
  key: KeyboardKeySchema,
  locate: z.string().optional(),
}).extend(LocateOptionSchema.shape);

// Scroll action parameters
export const ScrollParamsSchema = BaseActionParamsSchema.extend({
  scrollParam: ScrollParamSchema,
  locate: z.string().optional(),
}).extend(LocateOptionSchema.shape);

// Data query parameters
export const QueryParamsSchema = BaseActionParamsSchema.extend({
  dataDemand: z.union([z.string(), z.record(z.string(), z.string())]),
}).extend(InsightExtractOptionSchema.shape);

// Assertion parameters
export const AssertParamsSchema = BaseActionParamsSchema.extend({
  assertion: z.string(),
  errorMsg: z.string().optional(),
}).extend(AgentAssertOptSchema.shape);

// Wait parameters
export const WaitForParamsSchema = BaseActionParamsSchema.extend({
  assertion: z.string(),
}).extend(AgentWaitForOptSchema.shape);

// Element description parameters
export const DescribeElementParamsSchema = BaseActionParamsSchema.extend({
  x: z.number(),
  y: z.number(),
}).extend(LocatorValidatorOptionSchema.shape);

// YAML script parameters
export const YamlParamsSchema = BaseActionParamsSchema.extend({
  yamlScriptContent: z.string(),
});

// Context setting parameters
export const ContextParamsSchema = BaseActionParamsSchema.extend({
  actionContext: z.string(),
});

// JavaScript execution parameters
export const JavaScriptParamsSchema = BaseActionParamsSchema.extend({
  script: z.string(),
});

// Screenshot parameters
export const ScreenshotParamsSchema = BaseActionParamsSchema.extend({
  title: z.string().optional(),
  content: z.string().optional(),
});

// ============================================================================
// Unified action definition (Unified Action Definition)
// ============================================================================

// AI action union type
export const AIActionSchema = z.discriminatedUnion('type', [
  // AI planning actions
  AIPlanningParamsSchema.extend({ type: z.literal('ai') }),
  AIPlanningParamsSchema.extend({ type: z.literal('aiAction') }),

  // Interaction actions
  InteractionParamsSchema.extend({ type: z.literal('aiTap') }),
  InteractionParamsSchema.extend({ type: z.literal('aiHover') }),
  InteractionParamsSchema.extend({ type: z.literal('aiRightClick') }),
  InteractionParamsSchema.extend({ type: z.literal('aiDoubleClick') }),
  InteractionParamsSchema.extend({ type: z.literal('aiLocate') }),

  // Input actions
  InputParamsSchema.extend({ type: z.literal('aiInput') }),

  // Keyboard actions
  KeyboardParamsSchema.extend({ type: z.literal('aiKeyboardPress') }),

  // Scroll actions
  ScrollParamsSchema.extend({ type: z.literal('aiScroll') }),

  // Data query actions
  QueryParamsSchema.extend({ type: z.literal('aiQuery') }),
  QueryParamsSchema.extend({ type: z.literal('aiExtract') }),
  AIPlanningParamsSchema.extend(InsightExtractOptionSchema.shape).extend({ type: z.literal('aiAsk') }),
  AIPlanningParamsSchema.extend(InsightExtractOptionSchema.shape).extend({ type: z.literal('aiBoolean') }),
  AIPlanningParamsSchema.extend(InsightExtractOptionSchema.shape).extend({ type: z.literal('aiNumber') }),
  AIPlanningParamsSchema.extend(InsightExtractOptionSchema.shape).extend({ type: z.literal('aiString') }),

  // Assertion and wait actions
  AssertParamsSchema.extend({ type: z.literal('aiAssert') }),
  WaitForParamsSchema.extend({ type: z.literal('aiWaitFor') }),

  // Advanced actions
  DescribeElementParamsSchema.extend({ type: z.literal('describeElementAtPoint') }),
  YamlParamsSchema.extend({ type: z.literal('runYaml') }),
  ContextParamsSchema.extend({ type: z.literal('setAIActionContext') }),
  JavaScriptParamsSchema.extend({ type: z.literal('evaluateJavaScript') }),
  ScreenshotParamsSchema.extend({ type: z.literal('logScreenshot') }),

  // Page context actions
  BaseActionParamsSchema.extend({ type: z.literal('freezePageContext') }),
  BaseActionParamsSchema.extend({ type: z.literal('unfreezePageContext') }),
  BaseActionParamsSchema.extend({
    type: z.literal('verifyLocator'),
    prompt: z.string(),
    expectCenter: PointSchema,
  }).extend(LocatorValidatorOptionSchema.shape),
]);

export type AIAction = z.infer<typeof AIActionSchema>;

// ============================================================================
// Test Steps and Sequences Definition
// ============================================================================

// Test step base fields
export const TestStepBaseSchema = z.object({
  id: z.string(),
  description: z.string(),
  status: TestStepStatusSchema,
  startTime: z.number().optional(),
  endTime: z.number().optional(),
  error: z.string().optional(),
  result: z.any().optional(),
  rawCode: z.string(),
  executionTime: z.number().optional(),
  retryCount: z.number().optional(),
  success: z.boolean().optional(),
});

// Test step = AI action + execution status
export const TestStepSchema = z.intersection(AIActionSchema, TestStepBaseSchema);

export type TestStep = z.infer<typeof TestStepSchema>;

// Action sequence
export const ActionSequenceSchema = z.object({
  actions: z.array(AIActionSchema),
  display: z.object({
    code: z.array(z.string()),
    description: z.string(),
  }),
});

export type ActionSequence = z.infer<typeof ActionSequenceSchema>;

// Test case
export const TestCaseSchema = z.object({
  id: z.string(),
  name: z.string(),
  userInput: z.string(),
  code: z.string().optional(),
  actionSequence: ActionSequenceSchema.optional(),
  steps: z.array(TestStepSchema),
  status: TestCaseStatusSchema,
  startTime: z.number().optional(),
  endTime: z.number().optional(),
  error: z.string().optional(),
});

export type TestCase = z.infer<typeof TestCaseSchema>;

// Execution session
export const ExecutionSessionSchema = z.object({
  id: z.string(),
  testCases: z.array(TestCaseSchema),
  startTime: z.number().optional(),
  endTime: z.number().optional(),
  activeTestCaseId: z.string().optional(),
});

export type ExecutionSession = z.infer<typeof ExecutionSessionSchema>;

// ============================================================================
// Automation Agent Configuration Options
// ============================================================================

export const AutomationAgentOptionsSchema = z.object({
  generateReport: z.boolean().optional(),
  reportFileName: z.string().optional(),
  actionContext: z.string().optional(),
  waitForNetworkIdleTimeout: z.number().optional(),
  waitForNavigationTimeout: z.number().optional(),
});

export type AutomationAgentOptions = z.infer<typeof AutomationAgentOptionsSchema>;

// ============================================================================
// Export all schemas for validation
// ============================================================================

export const schemas = {
  // Basic types
  Point: PointSchema,
  ScrollDirection: ScrollDirectionSchema,
  ScrollType: ScrollTypeSchema,
  DomIncludeOption: DomIncludeOptionSchema,
  KeyboardKey: KeyboardKeySchema,
  TestStepStatus: TestStepStatusSchema,
  TestCaseStatus: TestCaseStatusSchema,
  AIActionType: AIActionTypeSchema,

  // Option types
  LocateOption: LocateOptionSchema,
  AndroidDeviceInputOpt: AndroidDeviceInputOptSchema,
  ScrollParam: ScrollParamSchema,
  InsightExtractOption: InsightExtractOptionSchema,
  AgentAssertOpt: AgentAssertOptSchema,
  AgentWaitForOpt: AgentWaitForOptSchema,
  LocatorValidatorOption: LocatorValidatorOptionSchema,

  // Action parameters
  BaseActionParams: BaseActionParamsSchema,
  AIPlanningParams: AIPlanningParamsSchema,
  InteractionParams: InteractionParamsSchema,
  InputParams: InputParamsSchema,
  KeyboardParams: KeyboardParamsSchema,
  ScrollParams: ScrollParamsSchema,
  QueryParams: QueryParamsSchema,
  AssertParams: AssertParamsSchema,
  WaitForParams: WaitForParamsSchema,
  DescribeElementParams: DescribeElementParamsSchema,
  YamlParams: YamlParamsSchema,
  ContextParams: ContextParamsSchema,
  JavaScriptParams: JavaScriptParamsSchema,
  ScreenshotParams: ScreenshotParamsSchema,

  // Core types
  AIAction: AIActionSchema,
  TestStep: TestStepSchema,
  ActionSequence: ActionSequenceSchema,
  TestCase: TestCaseSchema,
  ExecutionSession: ExecutionSessionSchema,
  AutomationAgentOptions: AutomationAgentOptionsSchema,
} as const;
