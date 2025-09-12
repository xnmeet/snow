import type { TestStep } from '@snow/core/shared';
import {
  CircleDashed,
  CircleCheck,
  CircleDot,
  CircleX,
  RotateCw,
  TriangleAlert,
  CircleSlash,
} from 'lucide-react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@snow/core/ui';

export interface TestStepItemProps {
  step: TestStep;
  onRerun?: (step: TestStep) => void;
  onSkip?: (step: TestStep) => void;
}

const StatusIcon = ({ status }: { status: TestStep['status'] }) => {
  switch (status) {
    case 'pending':
      return <CircleDot size={16} className="shrink-0 text-gray-400" />;
    case 'running':
      return <CircleDashed size={16} className="shrink-0 text-blue-500 animate-spin" />;
    case 'success':
      return <CircleCheck size={16} className="shrink-0 text-green-500" />;
    case 'failed':
      return <CircleX size={16} className="shrink-0 text-red-500" />;
    case 'skipped':
      return <CircleSlash size={16} className="shrink-0 text-gray-400" />;
    default:
      return <CircleDot size={16} className="shrink-0 text-gray-400" />;
  }
};

/**
 * Test Step Component
 * Displays status, description, and error information for a single test step
 */
export const TestStepItem = ({ step, onRerun, onSkip }: TestStepItemProps) => {
  return (
    <div className="border border-gray-200 rounded-lg p-2 bg-white flex justify-between items-start gap-2">
      <div className="flex items-center gap-2 overflow-hidden w-full">
        <StatusIcon status={step.status} />

        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="w-0 flex-1">
              <pre className="text-xs whitespace-pre truncate">
                <code className="text-xs text-gray-900">{step.rawCode}</code>
              </pre>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="max-w-xs p-1" side="top" sideOffset={20}>
            <pre className="text-xs text-wrap bg-gray-100 p-2 rounded-md">
              <code className="text-xs text-gray-900">{step.rawCode}</code>
            </pre>
          </HoverCardContent>
        </HoverCard>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        {step.status === 'failed' && step.error && (
          <Tooltip>
            <TooltipTrigger asChild>
              <TriangleAlert size={16} className="shrink-0 text-yellow-500" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">{step.error}</p>
            </TooltipContent>
          </Tooltip>
        )}

        {step.status === 'success' && onSkip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <CircleSlash size={16} className="shrink-0 text-gray-400" onClick={() => onSkip(step)} />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">Manually skip, no code will be generated after skipping</p>
            </TooltipContent>
          </Tooltip>
        )}

        {step.status === 'failed' && onRerun && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onRerun(step)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Rerun"
              >
                <RotateCw size={14} className="text-blue-500" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Rerun</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
};
