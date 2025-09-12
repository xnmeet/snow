import { useState, useEffect } from 'react';
import { AIConfigManager, globalAIConfigManager } from '@snow/core/shared';
import { Button, toast } from '@snow/core/ui';
import type { AIConfig, ModelType } from '@snow/core/shared';

import { ModelCard } from './ModelCard';
import { ModelFormDialog } from './ModelFormDialog';
import { Plus, Server } from 'lucide-react';

interface SettingsProps {
  onConfigRefresh?: () => void;
}

export const Settings = ({ onConfigRefresh }: SettingsProps) => {
  const [configs, setConfigs] = useState<AIConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<AIConfig | null>(null);

  // Load configuration
  const loadConfigs = async () => {
    try {
      setLoading(true);
      const allConfigs = globalAIConfigManager.getAllConfigs();
      setConfigs(allConfigs);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load configuration');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfigs();
  }, []);

  // Handle adding new model
  const handleAddModel = () => {
    setEditingConfig(null);
    setIsDialogOpen(true);
  };

  // Handle editing model
  const handleEditModel = (config: AIConfig) => {
    setEditingConfig(config);
    setIsDialogOpen(true);
  };

  // Handle deleting model
  const handleDeleteModel = async (config: AIConfig) => {
    try {
      const success = await globalAIConfigManager.deleteConfig(config.id);
      if (success) {
        await loadConfigs();
        onConfigRefresh?.(); // Notify parent component to refresh
      } else {
        toast.error('Failed to delete model');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete model');
    }
  };

  // Handle enabling/disabling model
  const handleToggleEnabled = async (config: AIConfig) => {
    try {
      await globalAIConfigManager.updateConfig(config.id, {
        isEnabled: !config.isEnabled,
      });
      await loadConfigs();
      onConfigRefresh?.(); // Notify parent component to refresh
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update model status');
    }
  };

  // Handle form submission
  const handleFormSubmit = async (data: {
    name: string;
    apiKey: string;
    baseURL: string;
    model: string;
    description: string;
    modelType: ModelType;
    isEnabled: boolean;
    deepThinkEnabled: boolean;
    deepThinkReasoning: boolean;
  }) => {
    try {
      const configData = {
        name: data.name,
        apiKey: data.apiKey,
        baseURL: data.baseURL,
        model: data.model,
        description: data.description,
        modelType: data.modelType,
        isEnabled: data.isEnabled,
        deepThink: {
          enabled: data.deepThinkEnabled,
          reasoning: data.deepThinkReasoning,
        },
      };

      if (editingConfig) {
        // Update existing configuration
        await globalAIConfigManager.updateConfig(editingConfig.id, configData);
      } else {
        // Add new configuration
        await globalAIConfigManager.addConfig(configData);
      }

      await loadConfigs();
      setIsDialogOpen(false);
      setEditingConfig(null);
      onConfigRefresh?.(); // Notify parent component to refresh
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save configuration');
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 bg-background min-h-screen">
      {/* Model Configuration Management */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-1">Model Configuration</h3>
            <p className="text-sm text-muted-foreground">Manage your AI model connection configurations</p>
          </div>
          <Button onClick={handleAddModel} variant="default" size="sm" className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Model
          </Button>
        </div>

        <ModelFormDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          editingConfig={editingConfig}
          onSubmit={handleFormSubmit}
        />

        {/* Model List */}
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">Loading model configuration...</p>
            </div>
          </div>
        ) : configs.length === 0 ? (
          <div className="text-center py-8">
            <div className="max-w-sm mx-auto">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                <Server className="h-6 w-6 text-muted-foreground" />
              </div>
              <h4 className="text-base font-medium text-foreground mb-1">No model configuration</h4>
              <p className="text-sm text-muted-foreground mb-4">Start adding your first AI model</p>
              <Button onClick={handleAddModel} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Model
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            {configs.map(config => (
              <ModelCard
                key={config.id}
                config={config}
                onToggleEnabled={handleToggleEnabled}
                onEdit={handleEditModel}
                onDelete={handleDeleteModel}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
