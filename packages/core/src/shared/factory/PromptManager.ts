import { ModelType } from './AIConfig';
import { PromptGenerator } from './promptGenerator';

export enum PromptScenario {
  TEST_GENERATION = 'test_generation',
}

export interface PromptTemplate {
  systemPrompt: string;
  temperature: number;
  modelType: ModelType;
  supportedFeatures?: {
    deepThink?: boolean;
    reasoning?: boolean;
  };
}

export class PromptManager {
  private static prompts: Record<PromptScenario, PromptTemplate> = {
    [PromptScenario.TEST_GENERATION]: {
      systemPrompt: PromptGenerator.generatePromptTemplate(),
      temperature: 0.7,
      modelType: ModelType.LANGUAGE,
      supportedFeatures: {
        deepThink: false,
        reasoning: true,
      },
    },
  };

  static getPrompt(scenario: PromptScenario): PromptTemplate {
    return this.prompts[scenario];
  }

  static updatePrompt(scenario: PromptScenario, template: PromptTemplate): void {
    this.prompts[scenario] = template;
  }

  static addCustomPrompt(scenario: string, template: PromptTemplate): void {
    this.prompts[scenario as PromptScenario] = template;
  }

  static getAllScenarios(): PromptScenario[] {
    return Object.values(PromptScenario);
  }

  static getSystemPrompt(scenario: PromptScenario): string {
    return this.prompts[scenario]?.systemPrompt || '';
  }

  static getTemperature(scenario: PromptScenario): number {
    return this.prompts[scenario]?.temperature || 0.7;
  }

  // Get supported scenarios by model type
  static getScenariosByModelType(modelType: ModelType): PromptScenario[] {
    return Object.entries(this.prompts)
      .filter(([_, template]) => template.modelType === modelType)
      .map(([scenario, _]) => scenario as PromptScenario);
  }

  // Get vision model supported scenarios
  static getVisionScenarios(): PromptScenario[] {
    return this.getScenariosByModelType(ModelType.VISION);
  }

  // Get language model supported scenarios
  static getLanguageScenarios(): PromptScenario[] {
    return this.getScenariosByModelType(ModelType.LANGUAGE);
  }

  // Get deep thinking supported scenarios
  static getDeepThinkScenarios(): PromptScenario[] {
    return Object.entries(this.prompts)
      .filter(([_, template]) => template.supportedFeatures?.deepThink === true)
      .map(([scenario, _]) => scenario as PromptScenario);
  }

  // Get reasoning supported scenarios
  static getReasoningScenarios(): PromptScenario[] {
    return Object.entries(this.prompts)
      .filter(([_, template]) => template.supportedFeatures?.reasoning === true)
      .map(([scenario, _]) => scenario as PromptScenario);
  }

  // Check if scenario supports specific model type
  static isScenarioSupportedByModelType(scenario: PromptScenario, modelType: ModelType): boolean {
    return this.prompts[scenario]?.modelType === modelType;
  }

  // Get template model type
  static getModelType(scenario: PromptScenario): ModelType {
    return this.prompts[scenario]?.modelType || ModelType.LANGUAGE;
  }

  // Get template supported features
  static getSupportedFeatures(scenario: PromptScenario): {
    deepThink?: boolean;
    reasoning?: boolean;
  } {
    return this.prompts[scenario]?.supportedFeatures || {};
  }
}
