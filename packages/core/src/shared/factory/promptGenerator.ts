import { schemas } from '../schemas';

/**
 * Generate Prompt definitions based on Zod schemas
 * Ensure complete consistency with type definitions
 */
export class PromptGenerator {
  /**
   * Generate TypeScript definition string for AI action types
   */
  static generateActionTypeDefinition(): string {
    const categorizedTypes = {
      'AI Planning & Execution': ['ai', 'aiAction'],
      'Interaction Actions': [
        'aiTap',
        'aiInput',
        'aiHover',
        'aiKeyboardPress',
        'aiScroll',
        'aiRightClick',
        'aiDoubleClick',
      ],
      'Element Location & Verification': ['aiLocate', 'aiWaitFor', 'aiAssert'],
      'Data Extraction & Query': ['aiQuery', 'aiExtract', 'aiAsk', 'aiBoolean', 'aiNumber', 'aiString'],
      'Advanced Features': [
        'runYaml',
        'evaluateJavaScript',
        'logScreenshot',
        'describeElementAtPoint',
        'verifyLocator',
        'freezePageContext',
        'unfreezePageContext',
        'setAIActionContext',
      ],
    };

    let definition = 'type AIActionType =\n';
    Object.entries(categorizedTypes).forEach(([category, types], index) => {
      definition += `  // ${category}\n`;
      types.forEach((type, typeIndex) => {
        const prefix = index === 0 && typeIndex === 0 ? '  ' : '  | ';
        definition += `${prefix}'${type}'\n`;
      });
    });
    definition += ';';

    return definition;
  }

  /**
   * Generate categorized action parameter definitions
   */
  static generateActionParameterDefinitions(): Record<string, string> {
    return {
      // Base parameters
      base: `{
  "type": string,  // AI action type from AIActionType enum
}`,

      // AI planning action parameters
      planning: `{
  "type": "ai" | "aiAction",
  "prompt": string,          // Natural language description of actions
  "cacheable"?: boolean      // Optional caching (default: true)
}`,

      // Interaction action parameters
      interaction: `{
  "type": "aiTap" | "aiHover" | "aiRightClick" | "aiDoubleClick" | "aiLocate",
  "locate": string,          // Element description or selector
  "deepThink"?: boolean,     // Enhanced AI precision (default: false)
  "cacheable"?: boolean      // Optional caching (default: true)
}`,

      // Input action parameters
      input: `{
  "type": "aiInput",
  "text": string,            // Text to input
  "locate": string,          // Target input element
  "autoDismissKeyboard"?: boolean, // Android keyboard handling (default: true)
  "deepThink"?: boolean,     // Enhanced AI precision (default: false)
  "cacheable"?: boolean      // Optional caching (default: true)
}`,

      // Keyboard action parameters
      keyboard: `{
  "type": "aiKeyboardPress",
  "key": string,             // Key to press (Enter, Tab, Escape, etc.)
  "locate"?: string,         // Optional target element
  "deepThink"?: boolean,     // Enhanced AI precision (default: false)
  "cacheable"?: boolean      // Optional caching (default: true)
}`,

      // Scroll action parameters
      scroll: `{
  "type": "aiScroll",
  "scrollParam": {
    "direction": "up" | "down" | "left" | "right",
    "scrollType": "once" | "untilBottom" | "untilTop" | "untilLeft" | "untilRight",
    "distance"?: number      // Scroll distance in pixels
  },
  "locate"?: string,         // Optional scroll container
  "deepThink"?: boolean,     // Enhanced AI precision (default: false)
  "cacheable"?: boolean      // Optional caching (default: true)
}`,

      // Data query parameters
      query: `{
  "type": "aiQuery" | "aiExtract",
  "dataDemand": string | Record<string, string>, // Data extraction format
  "domIncluded"?: boolean | 'visible-only',      // Include DOM info (default: false)
  "screenshotIncluded"?: boolean                 // Include screenshot (default: true)
}`,

      // Data extraction parameters
      extract: `{
  "type": "aiAsk" | "aiBoolean" | "aiNumber" | "aiString",
  "prompt": string,          // Extraction prompt
  "domIncluded"?: boolean | 'visible-only',      // Include DOM info (default: false)
  "screenshotIncluded"?: boolean                 // Include screenshot (default: true)
}`,

      // Assertion parameters
      assert: `{
  "type": "aiAssert",
  "assertion": string,       // Condition to verify
  "errorMsg"?: string,       // Custom error message on failure
  "timeoutMs"?: number       // Timeout in milliseconds (default: 15000)
}`,

      // Wait parameters
      waitFor: `{
  "type": "aiWaitFor",
  "assertion": string,       // Condition to wait for
  "timeoutMs"?: number,      // Timeout in milliseconds (default: 15000)
  "checkIntervalMs"?: number // Check interval in milliseconds (default: 3000)
}`,

      // Element description parameters
      describeElement: `{
  "type": "describeElementAtPoint",
  "x": number,               // X coordinate
  "y": number,               // Y coordinate
  "verifyPrompt"?: boolean,  // Verify element description
  "retryLimit"?: number,     // Retry attempts for verification
  "deepThink"?: boolean      // Enhanced AI precision (default: false)
}`,

      // Advanced features parameters
      advanced: `{
  "type": "runYaml" | "setAIActionContext" | "evaluateJavaScript" | "logScreenshot",

  // For runYaml:
  "yamlScriptContent"?: string, // YAML automation script content

  // For setAIActionContext:
  "actionContext"?: string,     // Background context for aiAction()

  // For evaluateJavaScript:
  "script"?: string,            // JavaScript code to execute

  // For logScreenshot:
  "title"?: string,             // Screenshot title
  "content"?: string            // Screenshot description
}`,
    };
  }

  /**
   * Generate complete Prompt template
   */
  static generatePromptTemplate(): string {
    const actionTypeDefinition = this.generateActionTypeDefinition();
    const parameterDefinitions = this.generateActionParameterDefinitions();

    return `You are a Midscene AI test generator. Generate a structured JSON object that describes a sequence of UI automation actions with complete type mapping from Midscene API definitions.

OUTPUT FORMAT FOR MIDSCENE API CONSUMPTION:
{
  "actions": AIAction[],
  "display": {
    "code": string[],
    "description": string
  }
}

TYPE DEFINITIONS (Auto-generated from Zod schemas):

${actionTypeDefinition}

PARAMETER DEFINITIONS BY CATEGORY:

1. AI PLANNING ACTIONS:
${parameterDefinitions.planning}

2. INTERACTION ACTIONS:
${parameterDefinitions.interaction}

3. INPUT ACTIONS:
${parameterDefinitions.input}

4. KEYBOARD ACTIONS:
${parameterDefinitions.keyboard}

5. SCROLL ACTIONS:
${parameterDefinitions.scroll}

6. DATA QUERY ACTIONS:
${parameterDefinitions.query}

7. DATA EXTRACTION ACTIONS:
${parameterDefinitions.extract}

8. ASSERTION ACTIONS:
${parameterDefinitions.assert}

9. WAIT ACTIONS:
${parameterDefinitions.waitFor}

10. ELEMENT DESCRIPTION ACTIONS:
${parameterDefinitions.describeElement}

11. ADVANCED ACTIONS:
${parameterDefinitions.advanced}

VALIDATION RULES:
- All actions MUST conform to the exact parameter structure for their type
- Field names MUST match exactly (case-sensitive)
- Optional fields can be omitted but should follow default value guidelines
- The generated JSON will be validated against Zod schemas

EXAMPLES WITH COMPLETE TYPE SAFETY:

{
  "actions": [
    {
      "type": "aiAction",
      "prompt": "Navigate to settings page and update user profile information",
      "cacheable": false
    },
    {
      "type": "aiTap",
      "locate": "settings icon in top navigation bar",
      "deepThink": true,
    },
    {
      "type": "aiInput",
      "text": "test.user@example.com",
      "locate": "email input field with label 'Email Address'",
      "autoDismissKeyboard": true
    },
    {
      "type": "aiScroll",
      "scrollParam": {
        "direction": "down",
        "distance": 300,
        "scrollType": "untilBottom"
      },
      "locate": "main content area"
    },
    {
      "type": "aiQuery",
      "dataDemand": {
        "formTitle": "text of the h1 element",
        "submitButtonText": "text of the submit button"
      },
      "domIncluded": false,
      "screenshotIncluded": true
    },
    {
      "type": "aiAssert",
      "assertion": "profile update success message is displayed",
      "errorMsg": "Profile should be updated successfully"
    }
  ],
  "display": {
    "code": [
      "await aiAction('Navigate to settings page and update user profile information', { cacheable: false });",
      "await aiTap('settings icon in top navigation bar', { deepThink: true });",
      "await aiInput('test.user@example.com', 'email input field with label \"Email Address\"', { autoDismissKeyboard: true });",
      "await aiScroll({ direction: 'down', distance: 300, scrollType: 'untilBottom' }, 'main content area');",
      "const queryResult = await aiQuery({ formTitle: 'text of the h1 element', submitButtonText: 'text of the submit button' }, { domIncluded: false, screenshotIncluded: true });",
      "await aiAssert('profile update success message is displayed', 'Profile should be updated successfully');"
    ],
    "description": "Complete profile update workflow with type-safe parameter mapping"
  }
}

IMPORTANT: The generated actions will be validated against Zod schemas to ensure type safety and API compatibility.`;
  }

  /**
   * Validate if generated actions conform to schema
   */
  static validateAction(action: unknown): { isValid: boolean; error?: string } {
    try {
      schemas.AIAction.parse(action);
      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Unknown validation error',
      };
    }
  }

  /**
   * Validate if action sequence conforms to schema
   */
  static validateActionSequence(sequence: unknown): { isValid: boolean; error?: string } {
    try {
      schemas.ActionSequence.parse(sequence);
      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Unknown validation error',
      };
    }
  }
}
