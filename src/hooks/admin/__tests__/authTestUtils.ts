
import { vi } from 'vitest';

// Create mock auth service
export const createMockAuthService = () => ({
  signInWithPassword: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  getUser: vi.fn(),
  getSession: vi.fn(),
  checkUserRoles: vi.fn(),
  createAdminIfNotExists: vi.fn(),
  resetAdminPassword: vi.fn(),
});

// Create mock toast
export const createMockToast = () => ({
  toast: vi.fn(),
});

// Mock form event
export const createMockFormEvent = () => ({
  preventDefault: vi.fn(),
});

// Mock set state functions
export const createMockSetState = () => vi.fn();
