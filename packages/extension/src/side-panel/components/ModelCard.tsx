import { type AIConfig, ModelType } from '@snow/core/shared';
import { Button, Badge, Switch } from '@snow/core/ui';
import { Edit, Trash2 } from 'lucide-react';

interface ModelCardProps {
  config: AIConfig;
  onToggleEnabled: (config: AIConfig) => void;
  onEdit: (config: AIConfig) => void;
  onDelete: (config: AIConfig) => void;
}

export const ModelCard = ({ config, onToggleEnabled, onEdit, onDelete }: ModelCardProps) => {
  return (
    <div
      className={`
        p-4 rounded-lg border transition-all duration-200
        ${config.isEnabled ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-border/80'}
      `}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-base font-semibold text-foreground">{config.name}</h4>
            <div className="flex gap-1 flex-wrap">
              <Badge
                variant={config.modelType === ModelType.VISION ? 'default' : 'secondary'}
                className="text-xs"
              >
                {config.modelType === ModelType.VISION ? 'Vision' : 'Language'}
              </Badge>
              {config.isEnabled && (
                <Badge variant="outline" className="text-xs bg-primary/10 border-primary text-primary">
                  Enabled
                </Badge>
              )}
              {config.deepThink.enabled && (
                <Badge variant="outline" className="text-xs">
                  Deep Thinking
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs">
              <span className="font-medium text-muted-foreground">Model:</span>
              <code className="px-1 py-0.5 bg-muted text-muted-foreground rounded text-xs font-mono">
                {config.model}
              </code>
            </div>

            <div className="flex items-center gap-1 text-xs">
              <span className="font-medium text-muted-foreground">URL:</span>
              <span className="text-muted-foreground font-mono text-xs truncate flex-1 w-0">
                {config.baseURL}
              </span>
            </div>

            {config.description && (
              <div className="flex items-start gap-1 text-xs">
                <span className="font-medium text-muted-foreground">Description:</span>
                <p className="text-muted-foreground flex-1 line-clamp-2">{config.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:flex-col sm:space-x-0 sm:space-y-2 sm:items-end flex-shrink-0">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">{config.isEnabled ? 'Enabled' : 'Disabled'}</span>
            <Switch
              checked={config.isEnabled}
              onCheckedChange={() => onToggleEnabled(config)}
              aria-label={config.isEnabled ? 'Disable model' : 'Enable model'}
            />
          </div>
          <Button
            onClick={() => onEdit(config)}
            variant="ghost"
            size="sm"
            title="Edit"
            className="h-7 px-2 text-xs"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            title="Delete"
            className="h-7 px-2 text-xs hover:text-destructive"
            onClick={() => onDelete(config)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
