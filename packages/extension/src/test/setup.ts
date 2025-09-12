// Test setup file
import { vi } from 'vitest';

// Mock Chrome API
global.chrome = {
  tabs: {
    query: vi.fn(),
  },
  scripting: {
    executeScript: vi.fn(),
  },
  runtime: {
    lastError: null,
  },
} as unknown as typeof chrome;

// Mock console methods to avoid test output
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};
