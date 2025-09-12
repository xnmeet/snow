import type { ChatSession } from '../types/chatTypes';

export interface IndexedDBConfig {
  dbName: string;
  version: number;
  storeName: string;
}

export class IndexedDBStorage {
  private db: IDBDatabase | null = null;
  private config: IndexedDBConfig;
  private isInitialized = false;

  constructor(config?: IndexedDBConfig) {
    this.config = config
      ? config
      : {
          dbName: 'SnowChatDB',
          version: 1,
          storeName: 'chat_sessions',
        };
  }

  async initialize(): Promise<void> {
    if (this.isInitialized && this.db) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.config.dbName, this.config.version);

      request.onerror = () => {
        reject(new Error(`Failed to open IndexedDB: ${request.error}`));
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.isInitialized = true;
        resolve();
      };

      request.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(this.config.storeName)) {
          const store = db.createObjectStore(this.config.storeName, { keyPath: 'id' });

          // Create indexes for efficient querying
          store.createIndex('updatedAt', 'updatedAt', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
          store.createIndex('title', 'title', { unique: false });
        }
      };
    });
  }

  async saveSession(session: ChatSession): Promise<void> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.config.storeName], 'readwrite');
      const store = transaction.objectStore(this.config.storeName);
      const request = store.put(session);

      request.onerror = () => {
        reject(new Error(`Failed to save session: ${request.error}`));
      };

      request.onsuccess = () => {
        resolve();
      };
    });
  }

  async saveSessions(sessions: ChatSession[]): Promise<void> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.config.storeName], 'readwrite');
      const store = transaction.objectStore(this.config.storeName);

      // Clear existing sessions and add new ones
      const clearRequest = store.clear();

      clearRequest.onerror = () => {
        reject(new Error(`Failed to clear sessions: ${clearRequest.error}`));
      };

      clearRequest.onsuccess = () => {
        if (sessions.length === 0) {
          resolve();
          return;
        }

        let completed = 0;
        sessions.forEach(session => {
          const request = store.put(session);
          request.onerror = () => {
            reject(new Error(`Failed to save session: ${request.error}`));
          };
          request.onsuccess = () => {
            completed++;
            if (completed === sessions.length) {
              resolve();
            }
          };
        });
      };
    });
  }

  async getSession(sessionId: string): Promise<ChatSession | undefined> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.config.storeName], 'readonly');
      const store = transaction.objectStore(this.config.storeName);
      const request = store.get(sessionId);

      request.onerror = () => {
        reject(new Error(`Failed to get session: ${request.error}`));
      };

      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  async getAllSessions(): Promise<ChatSession[]> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.config.storeName], 'readonly');
      const store = transaction.objectStore(this.config.storeName);
      const request = store.getAll();

      request.onerror = () => {
        reject(new Error(`Failed to get all sessions: ${request.error}`));
      };

      request.onsuccess = () => {
        // Sort by updatedAt descending (most recent first)
        const sessions = request.result.sort((a, b) => b.updatedAt - a.updatedAt);
        resolve(sessions);
      };
    });
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.config.storeName], 'readwrite');
      const store = transaction.objectStore(this.config.storeName);
      const request = store.delete(sessionId);

      request.onerror = () => {
        reject(new Error(`Failed to delete session: ${request.error}`));
      };

      request.onsuccess = () => {
        resolve();
      };
    });
  }

  async clearAllSessions(): Promise<void> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.config.storeName], 'readwrite');
      const store = transaction.objectStore(this.config.storeName);
      const request = store.clear();

      request.onerror = () => {
        reject(new Error(`Failed to clear all sessions: ${request.error}`));
      };

      request.onsuccess = () => {
        resolve();
      };
    });
  }

  async getSessionsByDateRange(startDate: Date, endDate: Date): Promise<ChatSession[]> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.config.storeName], 'readonly');
      const store = transaction.objectStore(this.config.storeName);
      const index = store.index('updatedAt');

      const range = IDBKeyRange.bound(startDate.getTime(), endDate.getTime());
      const request = index.getAll(range);

      request.onerror = () => {
        reject(new Error(`Failed to get sessions by date range: ${request.error}`));
      };

      request.onsuccess = () => {
        const sessions = request.result.sort((a, b) => b.updatedAt - a.updatedAt);
        resolve(sessions);
      };
    });
  }

  async countSessions(): Promise<number> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.config.storeName], 'readonly');
      const store = transaction.objectStore(this.config.storeName);
      const request = store.count();

      request.onerror = () => {
        reject(new Error(`Failed to count sessions: ${request.error}`));
      };

      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  async exportAllSessions(): Promise<string> {
    const sessions = await this.getAllSessions();
    return JSON.stringify(
      {
        sessions,
        exportDate: new Date().toISOString(),
        version: this.config.version,
      },
      null,
      2,
    );
  }

  async importSessions(jsonData: string): Promise<{ success: boolean; importedCount: number }> {
    try {
      const data = JSON.parse(jsonData);

      if (!data.sessions || !Array.isArray(data.sessions)) {
        throw new Error('Invalid import data format');
      }

      // Validate sessions
      const validSessions = data.sessions.filter(this.isValidSession);

      if (validSessions.length === 0) {
        return { success: false, importedCount: 0 };
      }

      // Clear existing sessions and import new ones
      await this.clearAllSessions();
      await this.saveSessions(validSessions);

      return { success: true, importedCount: validSessions.length };
    } catch (error) {
      console.error('Failed to import sessions:', error);
      return { success: false, importedCount: 0 };
    }
  }

  private isValidSession(session: any): session is ChatSession {
    return (
      session &&
      typeof session === 'object' &&
      typeof session.id === 'string' &&
      Array.isArray(session.messages) &&
      typeof session.createdAt === 'number' &&
      typeof session.updatedAt === 'number'
    );
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized || !this.db) {
      await this.initialize();
    }
  }

  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.isInitialized = false;
    }
  }

  async deleteDatabase(): Promise<void> {
    await this.close();

    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(this.config.dbName);

      request.onerror = () => {
        reject(new Error(`Failed to delete database: ${request.error}`));
      };

      request.onsuccess = () => {
        resolve();
      };
    });
  }
}
