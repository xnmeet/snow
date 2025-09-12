import { StreamingMarkdown, TextShimmer } from '@snow/core/components';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

export interface ThinkingMessageProps {
  content: string;
  isStreaming?: boolean;
}

export const ThinkingMessage = ({ content, isStreaming }: ThinkingMessageProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(isStreaming || false);
  }, [isStreaming]);

  if (!content) return null;

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      <div className="flex items-center gap-0.5 p-1">
        <div onClick={() => setIsExpanded(!isExpanded)} className="cursor-pointer visible hover:block">
          <ChevronRight
            size={16}
            onClick={() => setIsExpanded(!isExpanded)}
            className={clsx('transition-transform duration-300', isExpanded ? 'rotate-90' : '')}
          ></ChevronRight>
        </div>
        {isStreaming ? <TextShimmer>Thinking</TextShimmer> : 'Think'}
      </div>
      {isExpanded && (
        <StreamingMarkdown
          autoScrollDown={isStreaming}
          content={content}
          isStreaming={false}
          className="p-2 max-h-[200px] overflow-auto"
        />
      )}
    </div>
  );
};
