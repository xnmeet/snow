import OpenAI from 'openai';
import { PromptManager, PromptScenario } from './PromptManager';
import { type AIConfig, type AIConfigManager, ModelType, type DeepThinkConfig } from './AIConfig';

interface StreamCallbacks {
  onChunk: (content: string) => void;
  onReasoning?: (reasoning: string) => void;
  onComplete?: () => void;
  onError?: (error: string) => void;
}

interface GenerateOptions {
  scenario?: PromptScenario;
  customSystemPrompt?: string;
  temperature?: number;
  deepThink?: boolean; // whether to enable deep thinking, currently not consuming this configuration, using model endpoint's default behavior
  reasoning?: boolean; // Whether to enable reasoning process
}

export class AIClient {
  private client!: OpenAI;
  private currentConfig!: AIConfig;
  configManager!: AIConfigManager;

  constructor(configManager: AIConfigManager) {
    this.configManager = configManager;
    this.currentConfig = configManager.getEnabledConfigByType(ModelType.LANGUAGE)!;
    this.initializeClient();
  }

  private initializeClient(): void {
    this.client = new OpenAI({
      apiKey: this.currentConfig.apiKey,
      baseURL: this.currentConfig.baseURL,
      dangerouslyAllowBrowser: true,
    });
  }

  // Switch configuration
  switchConfig(configId: string): boolean {
    const config = this.configManager.getConfig(configId);
    if (!config) {
      return false;
    }

    this.currentConfig = config;
    this.initializeClient();
    return true;
  }

  async updateCurrentConfig(updates: Partial<AIConfig>): Promise<void> {
    if (!this.currentConfig.id) {
      throw new Error('Cannot update configuration without ID');
    }

    const updatedConfig = await this.configManager.updateConfig(this.currentConfig.id, updates);
    this.currentConfig = updatedConfig;
    this.initializeClient();
  }

  getCurrentConfig(): AIConfig {
    return { ...this.currentConfig };
  }

  get model(): string {
    return this.currentConfig.model;
  }

  get modelType(): ModelType {
    return this.currentConfig.modelType;
  }

  get deepThinkConfig(): DeepThinkConfig {
    return this.currentConfig.deepThink;
  }

  get isVisionModel(): boolean {
    return this.currentConfig.modelType === ModelType.VISION;
  }

  get isLanguageModel(): boolean {
    return this.currentConfig.modelType === ModelType.LANGUAGE;
  }

  get supportsDeepThink(): boolean {
    return this.currentConfig.deepThink.enabled;
  }

  async generateResponse(prompt: string, options: GenerateOptions = {}): Promise<string> {
    try {
      const { scenario = PromptScenario.TEST_GENERATION, customSystemPrompt, temperature } = options;

      const systemPrompt = customSystemPrompt || PromptManager.getSystemPrompt(scenario);
      const temp = temperature ?? PromptManager.getTemperature(scenario);

      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
        { role: 'user' as const, content: prompt },
      ];

      const completionParams: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming = {
        model: this.currentConfig.model,
        messages,
        temperature: temp,
      };

      const response = await this.client.chat.completions.create(completionParams);

      return response.choices[0]?.message?.content || 'No response generated';
    } catch (error) {
      console.error('Error generating response:', error);
      return 'Error occurred while generating response';
    }
  }

  generateStreamResponse(prompt: string, callbacks: StreamCallbacks, options: GenerateOptions = {}): void {
    const { scenario = PromptScenario.TEST_GENERATION, customSystemPrompt, temperature } = options;

    const systemPrompt = customSystemPrompt || PromptManager.getSystemPrompt(scenario);
    const temp = temperature ?? PromptManager.getTemperature(scenario);

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
      { role: 'user' as const, content: prompt },
    ];

    const completionParams: OpenAI.Chat.Completions.ChatCompletionCreateParamsStreaming = {
      model: this.currentConfig.model,
      messages,
      temperature: temp,
      stream: true,
    };

    this.client.chat.completions
      .create(completionParams)
      .then(stream => {
        (async () => {
          try {
            for await (const chunk of stream) {
              const delta = chunk.choices[0]?.delta as { content?: string; reasoning_content?: string };

              if (delta?.reasoning_content && callbacks.onReasoning) {
                callbacks.onReasoning(delta.reasoning_content);
              }

              if (delta?.content) {
                callbacks.onChunk(delta.content);
              }
            }
            if (callbacks.onComplete) {
              callbacks.onComplete();
            }
          } catch (error) {
            console.error('Error processing stream:', error);
            callbacks.onError?.('Error occurred while processing stream');
          }
        })();
      })
      .catch(error => {
        console.error('Error generating stream response:', error);
        callbacks.onError?.('Error occurred while generating response');
      });
  }

  async generateTestCode(prompt: string): Promise<string> {
    return this.generateResponse(prompt, { scenario: PromptScenario.TEST_GENERATION });
  }

  generateTestCodeStream(prompt: string, callbacks: StreamCallbacks): void {
    this.generateStreamResponse(prompt, callbacks, { scenario: PromptScenario.TEST_GENERATION });
  }

  // Utility methods
  getAvailableScenarios(): PromptScenario[] {
    return PromptManager.getAllScenarios();
  }

  // Get scenarios supported by current model type
  getSupportedScenarios(): PromptScenario[] {
    return PromptManager.getScenariosByModelType(this.modelType);
  }

  getScenarioInfo(scenario: PromptScenario) {
    return {
      systemPrompt: PromptManager.getSystemPrompt(scenario),
      temperature: PromptManager.getTemperature(scenario),
      modelType: PromptManager.getModelType(scenario),
      supportedFeatures: PromptManager.getSupportedFeatures(scenario),
    };
  }

  isScenarioCompatible(scenario: PromptScenario): boolean {
    return PromptManager.isScenarioSupportedByModelType(scenario, this.modelType);
  }

  getRecommendedScenarios(): PromptScenario[] {
    if (this.isVisionModel) {
      return PromptManager.getVisionScenarios();
    } else {
      return PromptManager.getLanguageScenarios();
    }
  }
}
