import { ChromeExtensionProxyPage, ChromeExtensionProxyPageAgent } from '@midscene/web/chrome-extension';
import type { TestStep, AIAction, ActionSequence } from '../automationTypes';
import { schemas } from '../schemas';
import { nanoid } from 'nanoid';
import JSON5 from 'json5';

export class AutomationAgent {
  private agent: ChromeExtensionProxyPageAgent | null = null;
  private page: ChromeExtensionProxyPage | null = null;
  private isInitialized = false;

  async createAgent() {
    // forceSameTabNavigation = true, ensures execution in the same tab
    this.page = new ChromeExtensionProxyPage(true);
    this.agent = new ChromeExtensionProxyPageAgent(this.page);
    this.isInitialized = true;
  }

  async executeStep(step: TestStep): Promise<TestStep> {
    // If Agent is already initialized, destroy and recreate to ensure each task execution is a new Agent, avoiding Chrome Debugger conflicts
    await this.destroy();
    await this.createAgent();

    if (!this.agent) {
      throw new Error('Agent not initialized');
    }

    step.status ||= 'running';
    step.startTime ||= Date.now();

    let result: any;

    try {
      // Build unified options object supporting new field structure
      const options = this.buildExecutionOptions(step);

      switch (step.type) {
        case 'ai':
          if (step.prompt) {
            result = await this.agent.ai(step.prompt, options);
          }
          break;

        case 'aiAction':
          if (step.prompt) {
            result = await this.agent.aiAction(step.prompt, {
              cacheable: step.cacheable ?? true,
              ...options,
            });
          }
          break;

        case 'aiTap':
          if (step.locate) {
            result = await this.agent.aiTap(step.locate, options);
          }
          break;

        case 'aiInput':
          if (step.text && step.locate) {
            result = await this.agent.aiInput(step.text, step.locate, {
              autoDismissKeyboard: step.autoDismissKeyboard ?? true,
              ...options,
            });
          }
          break;

        case 'aiHover':
          if (step.locate) {
            result = await this.agent.aiHover(step.locate, options);
          }
          break;

        case 'aiKeyboardPress':
          if (step.key) {
            result = await this.agent.aiKeyboardPress(step.key, step.locate, options);
          }
          break;

        case 'aiScroll':
          if (step.scrollParam) {
            result = await this.agent.aiScroll(step.scrollParam, step.locate, options);
          }
          break;

        case 'aiRightClick':
          if (step.locate) {
            result = await this.agent.aiRightClick(step.locate, options);
          }
          break;

        case 'aiDoubleClick':
          if (step.locate) {
            result = await this.agent.aiTap(`double click on ${step.locate}`, options);
          }
          break;

        case 'aiQuery':
          if (step.dataDemand) {
            result = await this.agent.aiQuery(step.dataDemand, {
              domIncluded: step.domIncluded ?? false,
              screenshotIncluded: step.screenshotIncluded ?? true,
              ...options,
            });
          }
          break;

        case 'aiExtract':
          if (step.dataDemand) {
            result = await this.agent.aiQuery(step.dataDemand, {
              domIncluded: step.domIncluded ?? false,
              screenshotIncluded: step.screenshotIncluded ?? true,
              ...options,
            });
          }
          break;

        case 'aiAssert':
          if (step.assertion) {
            result = await this.agent.aiAssert(step.assertion, step.errorMsg, {
              timeoutMs: step.timeoutMs || 15000,
              ...options,
            });
          }
          break;

        case 'aiWaitFor':
          if (step.assertion) {
            result = await this.agent.aiWaitFor(step.assertion, {
              timeoutMs: step.timeoutMs || 15000,
              checkIntervalMs: step.checkIntervalMs || 3000,
              ...options,
            });
          }
          break;

        case 'aiLocate':
          if (step.locate) {
            result = await this.agent.aiLocate(step.locate, options);
          }
          break;

        case 'aiAsk':
          if (step.prompt) {
            result = await this.agent.aiAsk(step.prompt, {
              domIncluded: step.domIncluded ?? false,
              screenshotIncluded: step.screenshotIncluded ?? true,
              ...options,
            });
          }
          break;

        case 'aiBoolean':
          if (step.prompt) {
            result = await this.agent.aiBoolean(step.prompt, {
              domIncluded: step.domIncluded ?? false,
              screenshotIncluded: step.screenshotIncluded ?? true,
              ...options,
            });
          }
          break;

        case 'aiNumber':
          if (step.prompt) {
            result = await this.agent.aiNumber(step.prompt, {
              domIncluded: step.domIncluded ?? false,
              screenshotIncluded: step.screenshotIncluded ?? true,
              ...options,
            });
          }
          break;

        case 'aiString':
          if (step.prompt) {
            result = await this.agent.aiString(step.prompt, {
              domIncluded: step.domIncluded ?? false,
              screenshotIncluded: step.screenshotIncluded ?? true,
              ...options,
            });
          }
          break;

        case 'logScreenshot':
          result = await this.agent.logScreenshot(step.title, {
            title: step.title,
            content: step.content,
            ...options,
          });
          break;

        case 'runYaml':
          if (step.yamlScriptContent) {
            result = await this.agent.runYaml(step.yamlScriptContent);
          }
          break;

        case 'setAIActionContext':
          if (step.actionContext) {
            this.agent.setAIActionContext(step.actionContext);
            result = true;
          }
          break;

        case 'evaluateJavaScript':
          if (step.script) {
            result = await this.agent.evaluateJavaScript(step.script);
          }
          break;

        case 'describeElementAtPoint':
          if (step.x !== undefined && step.y !== undefined) {
            result = await this.agent.describeElementAtPoint([step.x, step.y], {
              verifyPrompt: step.verifyPrompt,
              retryLimit: step.retryLimit,
              deepThink: step.deepThink,
              ...options,
            });
          }
          break;

        default:
          throw new Error(`Unsupported step type: ${step.type}`);
      }

      step.status = 'success';
      step.endTime = Date.now();
      step.result = result;
    } catch (error) {
      step.status = 'failed';
      step.endTime = Date.now();
      step.error = error instanceof Error ? error.message : 'Unknown error when executing step';
    } finally {
      await this.destroy();
    }

    return step;
  }

  // Build execution options
  private buildExecutionOptions(step: TestStep): any {
    const options: any = {};

    // Safely access potentially existing properties
    if ('deepThink' in step && step.deepThink !== undefined) {
      options.deepThink = step.deepThink;
    }
    if ('xpath' in step && step.xpath !== undefined) {
      options.xpath = step.xpath;
    }
    if ('cacheable' in step && step.cacheable !== undefined) {
      options.cacheable = step.cacheable;
    }
    if ('autoDismissKeyboard' in step && step.autoDismissKeyboard !== undefined) {
      options.autoDismissKeyboard = step.autoDismissKeyboard;
    }
    if ('domIncluded' in step && step.domIncluded !== undefined) {
      options.domIncluded = step.domIncluded;
    }
    if ('screenshotIncluded' in step && step.screenshotIncluded !== undefined) {
      options.screenshotIncluded = step.screenshotIncluded;
    }
    if ('timeoutMs' in step && step.timeoutMs !== undefined) {
      options.timeoutMs = step.timeoutMs;
    }
    if ('checkIntervalMs' in step && step.checkIntervalMs !== undefined) {
      options.checkIntervalMs = step.checkIntervalMs;
    }
    if ('verifyPrompt' in step && step.verifyPrompt !== undefined) {
      options.verifyPrompt = step.verifyPrompt;
    }
    if ('retryLimit' in step && step.retryLimit !== undefined) {
      options.retryLimit = step.retryLimit;
    }

    return options;
  }

  // Generate step description
  private generateDescription(action: AIAction): string {
    const features = [];
    if ('deepThink' in action && action.deepThink) features.push('deep think');
    if ('cacheable' in action && action.cacheable === false) features.push('no cache');
    if ('xpath' in action && action.xpath) features.push('xpath override');

    const featureText = features.length > 0 ? ` (${features.join(', ')})` : '';

    switch (action.type) {
      case 'ai':
        return `AI auto-plan: ${action.prompt}${featureText}`;
      case 'aiAction':
        return `AI action: ${action.prompt}${featureText}`;
      case 'aiTap':
        return `AI tap: ${action.locate}${featureText}`;
      case 'aiInput':
        return `AI input "${action.text}" to "${action.locate}"${featureText}`;
      case 'aiHover':
        return `AI hover: ${action.locate}${featureText}`;
      case 'aiKeyboardPress':
        const keyName = 'key' in action ? action.key : 'unknown';
        const keyTarget = 'locate' in action && action.locate ? ` on "${action.locate}"` : '';
        return `AI keyboard press "${keyName}"${keyTarget}${featureText}`;
      case 'aiScroll':
        const scrollInfo =
          'scrollParam' in action && action.scrollParam?.distance ? ` ${action.scrollParam.distance}px` : '';
        const scrollDirection = ('scrollParam' in action && action.scrollParam?.direction) || 'unknown';
        return `AI scroll ${scrollDirection}${scrollInfo}${featureText}`;
      case 'aiRightClick':
        const rightClickTarget = 'locate' in action ? action.locate : 'unknown';
        return `AI right click: ${rightClickTarget}${featureText}`;
      case 'aiDoubleClick':
        const doubleClickTarget = 'locate' in action ? action.locate : 'unknown';
        return `AI double click: ${doubleClickTarget}${featureText}`;
      case 'aiQuery':
        const queryDemand = 'dataDemand' in action ? action.dataDemand : '';
        const queryKeys = typeof queryDemand === 'object' ? Object.keys(queryDemand) : [queryDemand];
        return `AI query: ${queryKeys.join(', ')}${featureText}`;
      case 'aiExtract':
        const extractDemand = 'dataDemand' in action ? action.dataDemand : '';
        const extractKeys = typeof extractDemand === 'object' ? Object.keys(extractDemand) : [extractDemand];
        return `AI extract: ${extractKeys.join(', ')}${featureText}`;
      case 'aiAssert':
        const assertCondition = 'assertion' in action ? action.assertion : 'unknown';
        return `AI assert: ${assertCondition}${featureText}`;
      case 'aiWaitFor':
        const waitCondition = 'assertion' in action ? action.assertion : 'unknown';
        const timeoutInfo =
          'timeoutMs' in action && action.timeoutMs ? ` (timeout: ${action.timeoutMs}ms)` : '';
        return `AI wait for: ${waitCondition}${timeoutInfo}${featureText}`;
      case 'aiLocate':
        const locateTarget = 'locate' in action ? action.locate : 'unknown';
        return `AI locate: ${locateTarget}${featureText}`;
      case 'aiAsk':
        const askPrompt = 'prompt' in action ? action.prompt : 'unknown';
        return `AI ask: ${askPrompt}${featureText}`;
      case 'aiBoolean':
        const boolPrompt = 'prompt' in action ? action.prompt : 'unknown';
        return `AI boolean: ${boolPrompt}${featureText}`;
      case 'aiNumber':
        const numberPrompt = 'prompt' in action ? action.prompt : 'unknown';
        return `AI number: ${numberPrompt}${featureText}`;
      case 'aiString':
        const stringPrompt = 'prompt' in action ? action.prompt : 'unknown';
        return `AI string: ${stringPrompt}${featureText}`;
      case 'logScreenshot':
        const screenshotTitle = 'title' in action ? action.title : 'screenshot';
        return `Log screenshot: ${screenshotTitle || 'screenshot'}${featureText}`;
      case 'runYaml':
        return `Run YAML script${featureText}`;
      case 'setAIActionContext':
        const contextValue = 'actionContext' in action ? action.actionContext : 'unknown';
        return `Set AI action context: ${contextValue}${featureText}`;
      case 'evaluateJavaScript':
        return `Evaluate JavaScript${featureText}`;
      case 'describeElementAtPoint':
        const coords =
          'x' in action && 'y' in action && action.x !== undefined && action.y !== undefined
            ? `(${action.x}, ${action.y})`
            : 'unknown';
        return `Describe element at point: ${coords}${featureText}`;
      default:
        return `Unknown action: ${action.type}`;
    }
  }

  // Parse test code into test steps
  parseTestCode(code: string): TestStep[] {
    try {
      // Try to parse as JSON format test code
      const rawParsed = JSON5.parse(code);

      // Use Zod to validate data structure
      const parsed = schemas.ActionSequence.parse(rawParsed);

      return parsed.actions.map(
        (action, index): TestStep => ({
          ...action, // Directly copy all fields, type has been validated by Zod
          id: nanoid(),
          description: this.generateDescription(action),
          status: 'pending' as const,
          rawCode: parsed.display.code[index],
        }),
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error when parsing test code';
      throw new Error(`Failed to parse test code: ${errorMessage}`);
    }
  }

  // Parse action sequence into test steps
  parseTestActionSequence(actionSequence: ActionSequence): TestStep[] {
    return actionSequence.actions.map(
      (action, index): TestStep => ({
        ...action, // Directly copy all fields, type has been validated by Zod
        id: nanoid(),
        description: this.generateDescription(action),
        status: 'pending' as const,
        rawCode: actionSequence.display.code[index],
      }),
    );
  }

  // Parse code or action into test steps
  parseTestCodeOrActionSequence(actionSequence?: ActionSequence, code?: string): TestStep[] {
    if (actionSequence) {
      return this.parseTestActionSequence(actionSequence);
    }
    if (code) {
      return this.parseTestCode(code);
    }
    return [];
  }

  isReady(): boolean {
    return this.isInitialized && this.agent !== null;
  }

  reset(): void {
    this.agent = null;
    this.page = null;
    this.isInitialized = false;
  }

  // Destroy Agent and clean up resources
  async destroy(): Promise<void> {
    try {
      // Clean up page and agent instances
      if (this.agent) {
        await this.agent.page.destroy();
      }
    } catch (error) {
      console.error('Error during AutomationAgent destruction:', error);
    } finally {
      this.reset();
    }
  }
}
