import { useState, useEffect } from 'react';

export interface ITabInfo {
  title: string;
  url: string;
  id: number;
}

export interface IUseTabInfoOptions {
  // Whether to auto-update (listen for tab changes)
  autoUpdate?: boolean;
  // Whether to enable error handling
  enableErrorHandling?: boolean;
}

export interface UseTabInfoReturn {
  tab: ITabInfo | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to get current tab information
 * @param options Configuration options
 * @returns Tab info, loading status, error status, and refresh function
 */
export const useTabInfo = (options: IUseTabInfoOptions = {}): UseTabInfoReturn => {
  const { autoUpdate = true, enableErrorHandling = true } = options;
  const [tab, setTab] = useState<ITabInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTabInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if running in Chrome Extension environment
      if (typeof chrome === 'undefined' || !chrome.tabs) {
        throw new Error('Chrome Extension API not available');
      }

      const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });

      setTab({
        title: currentTab.title || 'Unknown',
        url: currentTab.url || 'Unknown',
        id: currentTab.id || 0,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get tab info';
      setError(errorMessage);

      if (enableErrorHandling) {
        // Provide default values in non-extension environment
        setTab({
          title: 'Development Mode',
          url: 'Unknown',
          id: 0,
        });
      } else {
        setTab(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTabInfo();

    if (!autoUpdate) {
      return;
    }

    // Listen for tab updates
    const handleTabUpdate = (tabId: number, changeInfo: chrome.tabs.OnUpdatedInfo, tab: chrome.tabs.Tab) => {
      if (tab.active) {
        setTab({
          title: tab.title || 'Unknown',
          url: tab.url || 'Unknown',
          id: tab.id || 0,
        });
      }
    };

    // Listen for tab activation changes
    const handleTabActivated = (activeInfo: chrome.tabs.OnActivatedInfo) => {
      fetchTabInfo();
    };

    // Add listeners
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.onUpdated.addListener(handleTabUpdate);
      chrome.tabs.onActivated.addListener(handleTabActivated);
    }

    // Cleanup function
    return () => {
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.onUpdated.removeListener(handleTabUpdate);
        chrome.tabs.onActivated.removeListener(handleTabActivated);
      }
    };
  }, [autoUpdate, enableErrorHandling]);

  const refetch = async () => {
    await fetchTabInfo();
  };

  return {
    tab,
    loading,
    error,
    refetch,
  };
};
