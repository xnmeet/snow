import { useEffect, useState } from 'react';
import { Toaster } from '@snow/core/ui';
import { ChatPanel } from './features/chat-panel';
import { globalAIConfigManager } from '@snow/core/shared';
import { Loader2 } from 'lucide-react';

function App() {
  const [loading, setLoading] = useState(true);

  const initConfig = async () => {
    setLoading(true);
    try {
      await globalAIConfigManager.initialize();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initConfig();
  }, []);

  return (
    <>
      <div className="h-full flex flex-col bg-gray-50">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        ) : (
          <ChatPanel />
        )}
      </div>
      <Toaster position="top-center" />
    </>
  );
}

export default App;
