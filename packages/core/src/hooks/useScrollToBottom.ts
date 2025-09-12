import { useCallback, useRef } from 'react';

export interface UseScrollToBottomOptions {
  /**
   * Scroll behavior, defaults to 'smooth'
   */
  behavior?: ScrollBehavior;
  /**
   * Scroll offset, defaults to 0
   */
  offset?: number;
}

export interface UseScrollToBottomReturn {
  /**
   * Function to manually scroll to bottom
   */
  scrollToBottom: () => void;
  /**
   * Check if already at bottom
   */
  isAtBottom: () => boolean;
  /**
   * Get scroll container reference
   */
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Hook for scrolling to bottom
 * @param options Configuration options
 * @returns Returns scroll-related methods and references
 */
export function useScrollToBottom(options: UseScrollToBottomOptions = {}): UseScrollToBottomReturn {
  const { behavior = 'smooth', offset = 0 } = options;

  const scrollRef = useRef<HTMLDivElement>(null);

  /**
   * Scroll to bottom
   */
  const scrollToBottom = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;

    const scrollHeight = element.scrollHeight;
    const targetScrollTop = scrollHeight - element.clientHeight - offset;

    element.scrollTo({
      top: Math.max(0, targetScrollTop),
      behavior,
    });
  }, [behavior, offset]);

  /**
   * Check if at bottom
   */
  const isAtBottom = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return false;

    const { scrollTop, scrollHeight, clientHeight } = element;
    const threshold = 10; // Allow 10px tolerance

    return scrollTop + clientHeight >= scrollHeight - threshold - offset;
  }, [offset]);

  return {
    scrollToBottom,
    isAtBottom,
    scrollRef,
  };
}
