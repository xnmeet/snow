import type React from 'react';
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';
import { Check, Clipboard } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { toast } from 'sonner';

export interface CodeViewProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  wrapLines?: boolean;
  className?: string;
}

export const CodeView: React.FC<CodeViewProps> = ({
  code,
  language = 'javascript',
  showLineNumbers = true,
  wrapLines = true,
  className,
}) => {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy code');
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className={cn('h-full overflow-auto no-scrollbar', className)}>
      <SyntaxHighlighter
        language={language}
        style={isDark ? oneDark : oneLight}
        showLineNumbers={showLineNumbers}
        wrapLines={wrapLines}
        wrapLongLines={wrapLines}
        PreTag={({ children, ...props }) => (
          <div {...props} className="!m-0 no-scrollbar h-full">
            {children}
          </div>
        )}
      >
        {code}
      </SyntaxHighlighter>

      <Tooltip>
        <TooltipTrigger asChild>
          <div className="absolute top-2 right-1 z-10">
            <Button
              onClick={handleCopy}
              data-slot="copy-button"
              size="icon"
              variant={'ghost'}
              className="bg-code size-7 hover:opacity-100 focus-visible:opacity-100"
            >
              <span className="sr-only">Copy</span>
              {copied ? <Check /> : <Clipboard />}
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent>{copied ? 'Copied' : 'Copy to Clipboard'}</TooltipContent>
      </Tooltip>
    </div>
  );
};

export default CodeView;
