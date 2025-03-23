
import { vi } from 'vitest';
import { TextEncoder, TextDecoder } from 'util';

// Mock browser globals that aren't in JSDOM
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock localStorage for tests
class LocalStorageMock {
  store: Record<string, string>;
  
  constructor() {
    this.store = {};
  }
  
  getItem(key: string) {
    return this.store[key] || null;
  }
  
  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }
  
  removeItem(key: string) {
    delete this.store[key];
  }
  
  clear() {
    this.store = {};
  }
}

Object.defineProperty(window, 'localStorage', {
  value: new LocalStorageMock()
});

// Mock console methods
global.console = {
  ...console,
  // Mock implementation to avoid cluttering test output but still track calls
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
};
