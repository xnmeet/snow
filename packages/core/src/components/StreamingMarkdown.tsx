import { useState, useEffect, useMemo, useRef } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
import { cn } from '../lib/utils';

interface StreamingMarkdownProps {
  content: string;
  isStreaming?: boolean;
  speed?: number; // characters per second
  onStreamComplete?: () => void;
  className?: string;
  autoScrollDown?: boolean; // keep auto-scrolling to container bottom when text content changes
}

// Typewriter effect Hook
const useTypewriter = (text: string, speed = 50, isStreaming = false) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isStreaming) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    setDisplayedText('');
    setIsComplete(false);

    let index = 0;
    const timer = setInterval(() => {
      if (index <= text.length) {
        setDisplayedText(text.slice(0, index));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, 1000 / speed);

    return () => clearInterval(timer);
  }, [text, speed, isStreaming]);

  return { displayedText, isComplete };
};

export const StreamingMarkdown = ({
  content,
  isStreaming = false,
  speed = 50,
  onStreamComplete,
  className = '',
  autoScrollDown = false,
}: StreamingMarkdownProps) => {
  const { displayedText, isComplete } = useTypewriter(content, speed, isStreaming);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isComplete && onStreamComplete) {
      onStreamComplete();
    }
  }, [isComplete, onStreamComplete]);

  useEffect(() => {
    if (autoScrollDown && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayedText, autoScrollDown]);

  const markdownComponents: Components = useMemo(
    () => ({
      pre: ({ children }) => (
        <pre className="bg-gray-100 text-gray-800 p-1 text-wrap rounded text-xs">{children}</pre>
      ),
      // Custom code block rendering
      code: ({ children, ...props }) => {
        return (
          <code {...props} className={cn('bg-gray-100 text-gray-800')}>
            {children}
          </code>
        );
      },

      // Custom table styling
      table: ({ children }) => (
        <div className="overflow-x-auto my-4">
          <table className="min-w-full border border-gray-300 rounded-lg">{children}</table>
        </div>
      ),

      th: ({ children }) => (
        <th className="border border-gray-300 bg-gray-50 px-4 py-2 text-left font-medium">{children}</th>
      ),

      td: ({ children }) => <td className="border border-gray-300 px-4 py-2">{children}</td>,

      // Custom link styling
      a: ({ children, href }) => (
        <a
          href={href}
          className="text-blue-600 hover:text-blue-800 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      ),

      // Custom blockquote styling
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-gray-300 bg-gray-50 pl-4 py-2 my-4 italic">
          {children}
        </blockquote>
      ),

      // Custom heading styling
      h1: ({ children }) => (
        <h1 className="text-xl font-bold text-gray-900 mb-3 mt-4 first:mt-0">{children}</h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-lg font-semibold text-gray-900 mb-2 mt-3 first:mt-0">{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-base font-medium text-gray-900 mb-2 mt-3 first:mt-0">{children}</h3>
      ),

      // Custom paragraph styling
      p: ({ children }) => <p className="text-gray-700 leading-relaxed mb-3 last:mb-0">{children}</p>,

      // Custom list styling
      ul: ({ children }) => (
        <ul className="list-disc list-inside text-gray-700 mb-3 space-y-1">{children}</ul>
      ),
      ol: ({ children }) => (
        <ol className="list-decimal list-inside text-gray-700 mb-3 space-y-1">{children}</ol>
      ),
    }),
    [],
  );

  return (
    <div ref={containerRef} className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown
        components={markdownComponents}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {displayedText}
      </ReactMarkdown>
    </div>
  );
};
