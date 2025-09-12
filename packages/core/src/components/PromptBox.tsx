import React from 'react';

import { ArrowUp, StopCircle, Mic, Square, Sparkles } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Button,
  Textarea,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui';
import { VoiceRecorder } from './VoiceRecord';

// Custom Divider Component
const CustomDivider: React.FC = () => (
  <div className="relative h-6 w-[1.5px] mx-1">
    <div
      className="absolute inset-0 bg-gradient-to-t from-transparent via-[#9b87f5]/70 to-transparent rounded-full"
      style={{
        clipPath:
          'polygon(0% 0%, 100% 0%, 100% 40%, 140% 50%, 100% 60%, 100% 100%, 0% 100%, 0% 60%, -40% 50%, 0% 40%)',
      }}
    />
  </div>
);

// Model configuration interface
interface ModelConfig {
  id: string;
  name: string;
  type: 'language' | 'vision';
}

// Main PromptInputBox Component
interface PromptInputBoxProps {
  onSend?: (message: string, modelId?: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
  availableModels?: ModelConfig[];
  selectedModel?: string;
  onModelChange?: (modelId: string) => void;
}
export const PromptInputBox = (props: PromptInputBoxProps) => {
  const {
    onSend = () => {},
    isLoading = false,
    placeholder = 'Type your message here...',
    availableModels = [],
    selectedModel,
    onModelChange,
  } = props;
  const [input, setInput] = React.useState('');
  const [isRecording, setIsRecording] = React.useState(false);

  const handleSubmit = () => {
    if (input.trim()) {
      setInput('');
      onSend(input, selectedModel);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleStartRecording = () => console.log('Started recording');

  const handleStopRecording = (duration: number) => {
    console.log(`Stopped recording after ${duration} seconds`);
    setIsRecording(false);
    onSend(`[Voice message - ${duration} seconds]`);
  };

  const hasContent = input.trim() !== '';

  const sendIcon = () => {
    if (isLoading) return <Square className="h-5 w-5 transition-colors" />;
    if (hasContent) return <ArrowUp className="h-5 w-5 transition-colors" />;
    if (isRecording) return <StopCircle className="h-5 w-5 transition-colors" />;
    return <Mic className="h-5 w-5 transition-colors" />;
  };

  return (
    <div className="relative bg-background rounded-xl">
      <div
        className={cn(
          'transition-all duration-300',
          isRecording ? 'h-0 overflow-hidden opacity-0' : 'opacity-100',
        )}
      >
        <Textarea
          onKeyDown={handleKeyDown}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={placeholder}
          className="min-h-20 max-h-60 rounded-xl no-scrollbar resize-none pb-14 pt-4 focus-visible:ring-0 focus-visible:border-input"
        />
      </div>

      <Button
        variant="default"
        size="icon"
        className={cn(
          'h-8 w-8 rounded-full transition-all duration-200 absolute bottom-2 right-2',
          isRecording ? 'bg-transparent hover:bg-gray-600/30 text-red-500 hover:text-red-400' : '',
        )}
        onClick={() => {
          if (isRecording) setIsRecording(false);
          else if (hasContent) handleSubmit();
          else setIsRecording(true);
        }}
        disabled={isLoading && !hasContent}
      >
        {sendIcon()}
      </Button>

      {isRecording && (
        <VoiceRecorder
          isRecording={isRecording}
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
        />
      )}

      <div
        className={cn(
          'flex items-center gap-1 transition-opacity duration-300 absolute bottom-2 left-2',
          isRecording ? 'opacity-0 invisible h-0' : 'opacity-100 visible',
        )}
      >
        <div className="flex items-center">
          {availableModels.length > 0 && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size={'sm'} variant={'ghost'}>
                    <Sparkles />
                    {availableModels.find(m => m.id === selectedModel)?.name || 'Auto'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {availableModels.map(model => (
                    <DropdownMenuItem
                      key={model.id}
                      onSelect={() => {
                        onModelChange?.(model.id);
                      }}
                      className={cn(
                        'flex items-center justify-between cursor-pointer',
                        selectedModel === model.id && 'bg-accent',
                      )}
                    >
                      <span>{model.name}</span>
                      <span className="text-xs text-gray-500 capitalize">{model.type}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <CustomDivider />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
