import { z } from 'zod';
import { nanoid } from 'nanoid';
import { getStorage, setStorage } from '../messageHandler';

/**
 * Model type enumeration for AI configurations
 */
export enum ModelType {
  VISION = 'vision', // vision model
  LANGUAGE = 'language', // language model
}

/**
 * Deep thinking configuration schema
 */
export const DeepThinkConfigSchema = z.object({
  enabled: z.boolean().default(false),
  reasoning: z.boolean().optional().default(true),
});

/**
 * AI model configuration schema
 */
export const AIConfigSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(1, 'Name is required'),
  apiKey: z.string().min(1, 'API key is required'),
  baseURL: z.url('Invalid base URL format'),
  model: z.string().min(1, 'Model is required'),
  description: z.string().optional(),
  isEnabled: z.boolean().optional().default(false),
  modelType: z.enum(ModelType),
  deepThink: DeepThinkConfigSchema,
});

/**
 * AI model configuration interface
 */
export type AIConfig = z.infer<typeof AIConfigSchema>;

/**
 * Deep thinking configuration interface
 */
export type DeepThinkConfig = z.infer<typeof DeepThinkConfigSchema>;

/**
 * Storage data structure for AI configurations
 */
export type StorageData = {
  configs: Record<string, AIConfig>;
};

/**
 * AI Configuration Manager
 * Manages AI model configurations including CRUD operations, storage, and filtering
 */

export class AIConfigManager {
  configs: Map<string, AIConfig> = new Map();
  storageKey = 'S-AI-CONFIGS';
  initialized = false;

  /**
   * Initialize the AI configuration manager by loading configurations from storage
   * @returns Promise that resolves when initialization is complete
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await this.loadFromStorage();
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize AI configs from background:', error);
    }
  }

  /**
   * Add a new AI configuration
   * @param config - Configuration object without ID (ID will be auto-generated)
   * @returns Promise that resolves to the created configuration with generated ID
   */
  async addConfig(config: Omit<AIConfig, 'id'>): Promise<AIConfig> {
    const newConfig = AIConfigSchema.parse({
      ...config,
      id: nanoid(),
    });

    // Ensure only one model per type is enabled
    if (newConfig.isEnabled) {
      await this.ensureSingleEnabledPerType(newConfig.modelType, newConfig.id);
    }

    this.configs.set(newConfig.id, newConfig);
    await this.saveToStorage();
    return newConfig;
  }

  /**
   * Ensure only one model per type is enabled
   * @param modelType - The model type to ensure single enabled
   * @param excludeId - Configuration ID to exclude from disabling (the newly enabled one)
   */
  async ensureSingleEnabledPerType(modelType: ModelType, excludeId: string): Promise<void> {
    this.configs.forEach((config, id) => {
      if (config.modelType === modelType && id !== excludeId) {
        config.isEnabled = false;
      }
    });
  }

  /**
   * Update an existing AI configuration
   * @param id - Configuration ID to update
   * @param updates - Partial configuration object with fields to update
   * @returns Promise that resolves to the updated configuration
   * @throws Error if configuration with the specified ID is not found
   */
  async updateConfig(id: string, updates: Partial<Omit<AIConfig, 'id'>>): Promise<AIConfig> {
    const existingConfig = this.configs.get(id);
    if (!existingConfig) {
      throw new Error(`Configuration with id '${id}' not found`);
    }

    const updatedConfig = AIConfigSchema.parse({
      ...existingConfig,
      ...updates,
      id,
    });

    // Ensure only one model per type is enabled
    if (updatedConfig.isEnabled && !existingConfig.isEnabled) {
      await this.ensureSingleEnabledPerType(updatedConfig.modelType, id);
    }

    this.configs.set(id, updatedConfig);
    await this.saveToStorage();
    return updatedConfig;
  }

  /**
   * Delete an AI configuration
   * @param id - Configuration ID to delete
   * @returns Promise that resolves to true if deletion was successful, false otherwise
   * @remarks Will not delete if it's the only remaining configuration
   */
  async deleteConfig(id: string): Promise<boolean> {
    if (!this.configs.has(id)) return false;

    this.configs.delete(id);
    await this.saveToStorage();
    return true;
  }

  /**
   * Get a configuration by ID
   * @param id - Configuration ID
   * @returns The configuration object or undefined if not found
   */
  getConfig(id: string): AIConfig | undefined {
    return this.configs.get(id);
  }

  /**
   * Get all configurations
   * @returns Array of all configurations, sorted with enabled configurations first
   */
  getAllConfigs(): AIConfig[] {
    return Array.from(this.configs.values()).sort((a, b) =>
      a.isEnabled === b.isEnabled ? 0 : a.isEnabled ? -1 : 1,
    );
  }

  /**
   * Find a configuration by name (case-insensitive)
   * @param name - Configuration name to search for
   * @returns The configuration object or undefined if not found
   */
  findConfigByName(name: string): AIConfig | undefined {
    return Array.from(this.configs.values()).find(cfg => cfg.name.toLowerCase() === name.toLowerCase());
  }

  /**
   * Get configurations by model type
   * @param modelType - The model type to filter by
   * @returns Array of configurations matching the model type, sorted with enabled first
   */
  getConfigsByType(modelType: ModelType): AIConfig[] {
    return Array.from(this.configs.values())
      .filter(cfg => cfg.modelType === modelType)
      .sort((a, b) => (a.isEnabled === b.isEnabled ? 0 : a.isEnabled ? -1 : 1));
  }

  /**
   * Get all vision model configurations
   * @returns Array of vision model configurations
   */
  getVisionConfigs(): AIConfig[] {
    return this.getConfigsByType(ModelType.VISION);
  }

  /**
   * Get all language model configurations
   * @returns Array of language model configurations
   */
  getLanguageConfigs(): AIConfig[] {
    return this.getConfigsByType(ModelType.LANGUAGE);
  }

  /**
   * Get configurations that support deep thinking
   * @returns Array of configurations with deep thinking enabled
   */
  getDeepThinkConfigs(): AIConfig[] {
    return Array.from(this.configs.values())
      .filter(cfg => cfg.deepThink.enabled)
      .sort((a, b) => (a.isEnabled === b.isEnabled ? 0 : a.isEnabled ? -1 : 1));
  }

  /**
   * Get the enabled configuration for a specific model type
   * @param modelType - The model type to get enabled configuration for
   * @returns The enabled configuration for the model type, or undefined if none is enabled
   */
  getEnabledConfigByType(modelType: ModelType): AIConfig | undefined {
    return this.getConfigsByType(modelType).find(cfg => cfg.isEnabled);
  }

  /**
   * Clear all configurations
   * @returns Promise that resolves when all configurations are cleared
   */
  async clearAllConfigs(): Promise<void> {
    this.configs.clear();
    await this.saveToStorage();
  }

  /**
   * Load configurations from storage
   * @private
   */
  private async loadFromStorage(): Promise<void> {
    try {
      const data = (await getStorage([this.storageKey])) || {};
      const stored = data[this.storageKey] as StorageData | undefined;

      if (stored?.configs) {
        this.configs.clear();
        Object.entries(stored.configs).forEach(([id, config]) => {
          try {
            const validConfig = AIConfigSchema.parse(config);
            this.configs.set(id, validConfig);
          } catch {
            // skip invalid config
          }
        });
      }
    } catch (error) {
      console.error('Failed to load configs from background storage:', error);
    }
  }

  /**
   * Save configurations to storage
   * @private
   */
  private async saveToStorage(): Promise<void> {
    try {
      const data = {
        configs: Object.fromEntries(this.configs),
      };
      await setStorage({ [this.storageKey]: data });
    } catch (error) {
      console.error('Failed to save configs to background storage:', error);
    }
  }

  /**
   * Export all configurations as JSON string
   * @returns Promise that resolves to JSON string containing all configurations
   */
  async exportConfigs(): Promise<string> {
    return JSON.stringify(
      {
        configs: Object.fromEntries(this.configs),
        exportedAt: new Date().toISOString(),
      },
      null,
      2,
    );
  }

  /**
   * Import configurations from JSON string
   * @param jsonData - JSON string containing configuration data
   * @returns Promise that resolves to the number of configurations imported
   * @throws Error if the JSON data is invalid
   */
  async importConfigs(jsonData: string): Promise<number> {
    await this.initialize();

    const data = JSON.parse(jsonData) as StorageData;
    if (!data.configs) throw new Error('Invalid configuration data');

    let importCount = 0;
    Object.entries(data.configs).forEach(([id, config]) => {
      try {
        if (!this.configs.has(id)) {
          const validConfig = AIConfigSchema.parse(config);
          this.configs.set(id, validConfig);
          importCount++;
        }
      } catch {
        // skip invalid config
      }
    });

    await this.saveToStorage();
    return importCount;
  }
}

export const globalAIConfigManager = new AIConfigManager();
