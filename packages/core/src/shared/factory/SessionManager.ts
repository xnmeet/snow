import { nanoid } from 'nanoid';
import { IndexedDBStorage } from '../storage/IndexedDBStorage';
import type { ChatMessage, ChatSession } from '../types/chatTypes';

type SessionChangeEventType =
  | 'sessionCreated'
  | 'sessionUpdated'
  | 'sessionDeleted'
  | 'sessionsCleared'
  | 'currentSessionChanged';

interface SessionChangeEvent {
  type: SessionChangeEventType;
  sessionId?: string;
  session?: ChatSession;
  sessions?: ChatSession[];
}

type SessionChangeListener = (sessions: ChatSession[], event: SessionChangeEvent) => void;

export interface SessionManagerOptions {
  maxSessions?: number;
  autoSaveInterval?: number;
  storageKey?: string;
  dbName?: string;
  dbVersion?: number;
  storeName?: string;
}

export class SessionManager {
  private sessions: Map<string, ChatSession> = new Map();
  private currentSessionId: string | null = null;
  private options: Required<SessionManagerOptions>;
  private saveQueue: Set<string> = new Set();
  private isSaving = false;
  private storage: IndexedDBStorage;
  private listeners: Set<SessionChangeListener> = new Set();

  constructor(options: SessionManagerOptions = {}) {
    this.options = {
      maxSessions: 50,
      autoSaveInterval: 2000,
      storageKey: 'snow_chat_sessions',
      dbName: 'SnowChatDB',
      dbVersion: 1,
      storeName: 'chat_sessions',
      ...options,
    };

    this.storage = new IndexedDBStorage({
      dbName: this.options.dbName,
      version: this.options.dbVersion,
      storeName: this.options.storeName,
    });

    this.initialize();
  }

  private async initialize(): Promise<void> {
    await this.loadSessions();
  }

  private async loadSessions(): Promise<void> {
    try {
      await this.storage.initialize();
      const sessions = await this.storage.getAllSessions();

      sessions.forEach(session => {
        this.sessions.set(session.id, session);
      });
    } catch (error) {
      console.error('Failed to load sessions from IndexedDB:', error);
      // Fallback to empty sessions on error
      this.sessions.clear();
    }
  }

  private async processSaveQueue(): Promise<void> {
    if (this.isSaving || this.saveQueue.size === 0) return;

    this.isSaving = true;
    const sessionIds = Array.from(this.saveQueue);
    this.saveQueue.clear();

    try {
      if (sessionIds.includes('*')) {
        // Clear all and save all sessions
        const allSessions = Array.from(this.sessions.values());
        await this.storage.saveSessions(allSessions);
      } else {
        // Save individual sessions
        const sessionsToSave = sessionIds
          .map(id => this.sessions.get(id))
          .filter(session => session !== undefined) as ChatSession[];

        for (const session of sessionsToSave) {
          await this.storage.saveSession(session);
        }
      }
    } catch (error) {
      console.error('Failed to save sessions to IndexedDB:', error);
      // Re-add failed sessions to queue
      sessionIds.forEach(id => this.saveQueue.add(id));
    } finally {
      this.isSaving = false;
    }
  }

  private generateSessionTitle(messages: ChatMessage[]): string {
    const firstUserMessage = messages.find(msg => msg.type === 'user');
    if (firstUserMessage) {
      const content = firstUserMessage.content;
      return content;
    }
    return 'Untitled';
  }

  private updateSessionMetadata(session: ChatSession): void {
    session.metadata = {
      totalMessages: session.messages.length,
      testCasesCount: session.messages.filter(msg => msg.testCase).length,
    };
  }

  public createSession(initialMessages: ChatMessage[] = []): ChatSession {
    const session: ChatSession = {
      id: nanoid(),
      title: this.generateSessionTitle(initialMessages),
      messages: [...initialMessages],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.updateSessionMetadata(session);
    this.sessions.set(session.id, session);
    this.currentSessionId = session.id;

    // Enforce max sessions limit
    if (this.sessions.size > this.options.maxSessions) {
      this.cleanupOldSessions();
    }

    this.scheduleSave(session.id);

    // Emit session created event
    this.emitSessionChange({
      type: 'sessionCreated',
      sessionId: session.id,
      session: session,
    });

    return session;
  }

  private async cleanupOldSessions(): Promise<void> {
    const sessionsArray = Array.from(this.sessions.values());
    sessionsArray.sort((a, b) => b.updatedAt - a.updatedAt);

    const sessionsToRemove = sessionsArray.slice(this.options.maxSessions);

    for (const session of sessionsToRemove) {
      this.sessions.delete(session.id);
      if (this.currentSessionId === session.id) {
        this.currentSessionId = null;
      }

      // Delete from IndexedDB
      try {
        await this.storage.deleteSession(session.id);
      } catch (error) {
        console.error('Failed to delete session from IndexedDB during cleanup:', error);
      }
    }
  }

  public getSession(sessionId: string): ChatSession | undefined {
    return this.sessions.get(sessionId);
  }

  public getCurrentSession(): ChatSession | undefined {
    if (!this.currentSessionId) return undefined;
    return this.sessions.get(this.currentSessionId);
  }

  public setCurrentSession(sessionId: string): boolean {
    if (this.sessions.has(sessionId)) {
      const oldSessionId = this.currentSessionId;
      this.currentSessionId = sessionId;

      // Emit current session changed event only if it actually changed
      if (oldSessionId !== sessionId) {
        this.emitSessionChange({
          type: 'currentSessionChanged',
          sessionId: sessionId,
        });
      }

      return true;
    }
    return false;
  }

  public isSessionExecuting(): boolean {
    const session = this.getCurrentSession();
    if (!session) return false;
    return session.messages.some(msg => msg.testCase?.status === 'running');
  }

  public getCurrentSessionId(): string | null {
    return this.currentSessionId;
  }

  public updateSessionMessages(sessionId: string, messages: ChatMessage[], isAppend = false): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    session.messages = isAppend ? [...session.messages, ...messages] : messages;
    session.updatedAt = Date.now();

    this.sessions.set(sessionId, session);

    this.updateSessionMetadata(session);
    this.scheduleSave(sessionId);

    // Emit session updated event
    this.emitSessionChange({
      type: 'sessionUpdated',
      sessionId: sessionId,
      session: session,
    });

    return true;
  }

  public getAllSessions(): ChatSession[] {
    return Array.from(this.sessions.values()).sort((a, b) => b.updatedAt - a.updatedAt);
  }

  public async deleteSession(sessionId: string): Promise<void> {
    const sessionToDelete = this.sessions.get(sessionId);
    this.sessions.delete(sessionId);

    if (this.currentSessionId === sessionId) {
      const remainingSessions = this.getAllSessions();
      const newCurrentSessionId = remainingSessions.length > 0 ? remainingSessions[0].id : null;
      const oldSessionId = this.currentSessionId;
      this.currentSessionId = newCurrentSessionId;

      // Emit current session changed event if it actually changed
      if (oldSessionId !== newCurrentSessionId) {
        this.emitSessionChange({
          type: 'currentSessionChanged',
          sessionId: newCurrentSessionId || undefined,
        });
      }
    }

    // Delete from IndexedDB
    await this.storage.deleteSession(sessionId);

    // Emit session deleted event
    this.emitSessionChange({
      type: 'sessionDeleted',
      sessionId: sessionId,
      session: sessionToDelete,
    });
  }

  public clearAllSessions(): void {
    this.sessions.clear();
    this.currentSessionId = null;
    this.saveQueue.clear();
    this.scheduleSave('*');

    // Emit sessions cleared event
    this.emitSessionChange({
      type: 'sessionsCleared',
    });
  }

  private scheduleSave(sessionId: string): void {
    this.saveQueue.add(sessionId);
    this.processSaveQueue();
  }

  private emitSessionChange(event: SessionChangeEvent): void {
    const sessions = this.getAllSessions();
    this.listeners.forEach(listener => {
      try {
        listener(sessions, event);
      } catch (error) {
        console.error('Error in session change listener:', error);
      }
    });
  }

  /**
   * Subscribe to session changes with event-driven approach
   * @param callback Function to call when sessions change
   * @returns Unsubscribe function
   */
  public subscribeToSessionChanges(callback: (sessions: ChatSession[]) => void): () => void {
    const listener: SessionChangeListener = sessions => {
      callback(sessions);
    };

    this.listeners.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Subscribe to session changes with detailed event information
   * @param callback Function to call when sessions change, includes event details
   * @returns Unsubscribe function
   */
  public subscribeToSessionChangesWithEvents(callback: SessionChangeListener): () => void {
    this.listeners.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  public async exportSessions(): Promise<string> {
    try {
      return await this.storage.exportAllSessions();
    } catch (error) {
      console.error('Failed to export sessions:', error);
      // Fallback to memory export
      const sessionsData = {
        sessions: Array.from(this.sessions.values()),
        currentSessionId: this.currentSessionId,
        exportDate: new Date().toISOString(),
      };
      return JSON.stringify(sessionsData, null, 2);
    }
  }
}

/**
 * Global SessionManager instance for project-wide session management
 */
export const globalSessionManager = new SessionManager();
