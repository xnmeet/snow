import { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, toast } from '@snow/core/ui';
import { Input } from '@snow/core/ui';
import { Button } from '@snow/core/ui';
import { Trash2, MessageSquare, Search } from 'lucide-react';
import { globalSessionManager } from '@snow/core/shared';
import type { ChatSession } from '@snow/core/shared';

interface SessionDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSessionSelect: (sessionId: string) => void;
  currentSessionId?: string;
}

export const SessionDrawer = ({
  open,
  onOpenChange,
  onSessionSelect,
  currentSessionId,
}: SessionDrawerProps) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      loadSessions();
    }
  }, [open]);

  useEffect(() => {
    // Subscribe to session changes when drawer is open
    if (!open) return;

    const unsubscribe = globalSessionManager.subscribeToSessionChanges(updatedSessions => {
      setSessions(updatedSessions);
    });

    return () => {
      unsubscribe();
    };
  }, [open]);

  const loadSessions = () => {
    const allSessions = globalSessionManager.getAllSessions();
    setSessions(allSessions);
  };

  const filteredSessions = sessions.filter(
    session =>
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.messages.some(msg => msg.content.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const handleSessionSelect = (sessionId: string) => {
    globalSessionManager.setCurrentSession(sessionId);
    onSessionSelect(sessionId);
    onOpenChange(false);
  };

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (isDeleting === sessionId) return;

    setIsDeleting(sessionId);

    try {
      await globalSessionManager.deleteSession(sessionId);
      setIsDeleting(null);
      toast.success('Session deleted successfully');
    } catch (error) {
      setIsDeleting(null);
      toast.error('Failed to delete session');
      console.error('Failed to delete session:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`;

    return date.toLocaleDateString('en-US');
  };

  const getMessagePreview = (session: ChatSession) => {
    const lastMessage = session.messages[session.messages.length - 1];
    if (!lastMessage) return 'No messages';

    const preview = lastMessage.content.substring(0, 50);
    return preview.length < lastMessage.content.length ? `${preview}...` : preview;
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="rounded-t-lg">
        <div className="flex flex-col flex-1 h-0">
          <DrawerHeader className="px-4 py-3 flex items-center justify-between">
            <div>
              <DrawerTitle className="text-base font-semibold">History Sessions</DrawerTitle>
              <DrawerDescription className="text-xs text-muted-foreground">
                Select or manage your chat sessions
              </DrawerDescription>
            </div>
          </DrawerHeader>

          <div className="px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
            <div className="space-y-2">
              {filteredSessions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  {searchQuery ? 'No matching sessions found' : 'No session records'}
                </div>
              ) : (
                filteredSessions.map(session => (
                  <div
                    key={session.id}
                    className={`group relative p-3 rounded-lg border cursor-pointer transition-all hover:bg-accent/50 ${
                      session.id === currentSessionId ? 'border-primary bg-accent/30' : 'border-border'
                    }`}
                    onClick={() => handleSessionSelect(session.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <h4 className="text-sm font-medium truncate">{session.title || 'Unnamed session'}</h4>
                        </div>

                        <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                          {getMessagePreview(session)}
                        </p>

                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{session.messages.length} messages</span>
                          <span>{formatDate(session.updatedAt)}</span>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-7 w-7 p-0 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ${
                          isDeleting === session.id ? 'opacity-100' : ''
                        }`}
                        onClick={e => handleDeleteSession(session.id, e)}
                        disabled={isDeleting === session.id}
                      >
                        <Trash2 className={`h-3 w-3 ${isDeleting === session.id ? 'animate-pulse' : ''}`} />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
