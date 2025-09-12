import { useTabInfo } from '@snow/core/hooks';
import type { IUseTabInfoOptions } from '@snow/core/hooks';

export const TabInfo = ({ autoUpdate, enableErrorHandling }: IUseTabInfoOptions) => {
  const {
    tab: currentTab,
    loading,
    error,
  } = useTabInfo({
    autoUpdate,
    enableErrorHandling,
  });

  return (
    <>
      {loading && (
        <div className="p-3 bg-gray-50 border-b border-gray-200">
          <div className="text-sm font-medium text-gray-900">Loading tab info...</div>
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-50 border-b border-red-200">
          <div className="text-sm font-medium text-red-900">{error}</div>
        </div>
      )}
      {currentTab && !loading && !error && (
        <div className="p-3 bg-gray-50 border-b border-gray-200">
          <div className="text-sm font-medium text-gray-900 truncate">{currentTab.title}</div>
          <div className="text-xs text-gray-600 truncate">{currentTab.url}</div>
          <div className="text-xs text-gray-500">Tab ID: {currentTab.id}</div>
        </div>
      )}
    </>
  );
};
