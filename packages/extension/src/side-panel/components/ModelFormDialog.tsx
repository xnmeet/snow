import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  Switch,
} from '@snow/core/ui';
import { type AIConfig, ModelType } from '@snow/core/shared';
import { Server, Key, Globe, Type, Image } from 'lucide-react';

interface ModelFormData {
  name: string;
  apiKey: string;
  baseURL: string;
  model: string;
  description: string;
  modelType: ModelType;
  isEnabled: boolean;
  deepThinkEnabled: boolean;
  deepThinkReasoning: boolean;
}

const defaultFormData: ModelFormData = {
  name: '',
  apiKey: '',
  baseURL: '',
  model: '',
  description: '',
  modelType: ModelType.LANGUAGE,
  isEnabled: false,
  deepThinkEnabled: false,
  deepThinkReasoning: true,
};

// Reusable form field component
interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  description?: string;
  type?: 'text' | 'password' | 'url';
  icon?: React.ReactNode;
  className?: string;
}

const FormField = ({ id, label, value, onChange, placeholder, required, type = 'text' }: FormFieldProps) => (
  <div className="space-y-1">
    <div className="space-y-1">
      <Label htmlFor={id} className="text-sm font-medium flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
    </div>
    <div className="relative">
      <Input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        className="text-sm"
      />
    </div>
  </div>
);

// Reusable checkbox component
interface FormCheckboxProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

const FormCheckbox = ({ id, label, checked, onChange, className = '' }: FormCheckboxProps) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <Checkbox id={id} checked={checked} onCheckedChange={checked => onChange(checked as boolean)} />
    <Label htmlFor={id} className="text-sm font-medium cursor-pointer select-none flex-1">
      <div className="flex flex-col">
        <span>{label}</span>
      </div>
    </Label>
  </div>
);

interface ModelFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingConfig: AIConfig | null;
  onSubmit: (data: ModelFormData) => Promise<void>;
}

export const ModelFormDialog = ({ isOpen, onOpenChange, editingConfig, onSubmit }: ModelFormDialogProps) => {
  const [formData, setFormData] = useState<ModelFormData>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingConfig) {
      setFormData({
        name: editingConfig.name,
        apiKey: editingConfig.apiKey,
        baseURL: editingConfig.baseURL,
        model: editingConfig.model,
        description: editingConfig.description || '',
        modelType: editingConfig.modelType,
        isEnabled: editingConfig.isEnabled || false,
        deepThinkEnabled: editingConfig.deepThink.enabled,
        deepThinkReasoning: editingConfig.deepThink.reasoning,
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [editingConfig, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.apiKey || !formData.baseURL || !formData.model) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            {editingConfig ? 'Edit Model' : 'Add New Model'}
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            {editingConfig ? 'Modify existing model configuration' : 'Add new AI model configuration'}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField
              id="name"
              label="Model Name"
              value={formData.name}
              onChange={value => setFormData(prev => ({ ...prev, name: value }))}
              placeholder="e.g., GPT-4 Turbo"
              required
              description="Friendly name for identifying the model"
              icon={<Type className="h-4 w-4" />}
            />

            <div className="space-y-1">
              <Label htmlFor="modelType" className="text-sm font-medium">
                Model Type
              </Label>
              <Select
                value={formData.modelType}
                onValueChange={value => setFormData(prev => ({ ...prev, modelType: value as ModelType }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select model type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ModelType.LANGUAGE}>
                    <div className="flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      <span>Language Model</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={ModelType.VISION}>
                    <div className="flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      <span>Vision Model</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <FormField
              id="apiKey"
              label="API Key"
              value={formData.apiKey}
              onChange={value => setFormData(prev => ({ ...prev, apiKey: value }))}
              placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              required
              description="Access key obtained from AI service provider"
              type="password"
              icon={<Key className="h-4 w-4" />}
              className="font-mono text-sm"
            />

            <FormField
              id="baseURL"
              label="Base URL"
              value={formData.baseURL}
              onChange={value => setFormData(prev => ({ ...prev, baseURL: value }))}
              placeholder="https://api.openai.com/v1"
              required
              description="Base address for API service"
              type="url"
              icon={<Globe className="h-4 w-4" />}
            />

            <FormField
              id="model"
              label="Model ID"
              value={formData.model}
              onChange={value => setFormData(prev => ({ ...prev, model: value }))}
              placeholder="e.g., gpt-4-turbo-preview"
              required
              description="Specific model identifier"
              icon={<Server className="h-4 w-4" />}
              className="font-mono text-sm"
            />

            <FormField
              id="description"
              label="Description"
              value={formData.description}
              onChange={value => setFormData(prev => ({ ...prev, description: value }))}
              placeholder="e.g., High-performance model for complex reasoning tasks"
              description="Additional model description (optional)"
              className="sm:col-span-2"
            />
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="isEnabled" className="text-sm font-medium">Enable this model</Label>
                <p className="text-xs text-muted-foreground">This configuration will be used for this model type when enabled</p>
              </div>
              <Switch
                id="isEnabled"
                checked={formData.isEnabled}
                onCheckedChange={checked => setFormData(prev => ({ ...prev, isEnabled: checked }))}
              />
            </div>

            <FormCheckbox
              id="deepThinkEnabled"
              label="Enable Deep Thinking"
              description="Enhance complex problem-solving capabilities"
              checked={formData.deepThinkEnabled}
              onChange={checked => setFormData(prev => ({ ...prev, deepThinkEnabled: checked }))}
            />

            {formData.deepThinkEnabled && (
              <FormCheckbox
                id="deepThinkReasoning"
                label="Show Reasoning Process"
                description="Display detailed reasoning steps in responses"
                checked={formData.deepThinkReasoning}
                onChange={checked => setFormData(prev => ({ ...prev, deepThinkReasoning: checked }))}
                className="ml-6"
              />
            )}
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {editingConfig ? 'Update Configuration' : 'Add Model'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
