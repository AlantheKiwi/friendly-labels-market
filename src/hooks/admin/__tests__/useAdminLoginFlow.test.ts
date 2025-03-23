
import { renderHook } from '@testing-library/react-hooks';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAdminLoginFlow } from '../useAdminLoginFlow';
import { createMockAuthService, createMockFormEvent, createMockSetState } from './authTestUtils';

// Mock the dependent hooks to isolate testing
vi.mock('../usePasswordValidation', () => ({
  usePasswordValidation: () => ({
    comparePasswords: vi.fn().mockReturnValue(true),
    passwordDetails: null
  })
}));

vi.mock('../useLoginAttempts', () => ({
  useLoginAttempts: () => ({
    attemptLoginWithDefaultPassword: vi.fn().mockResolvedValue(false),
    attemptLoginWithEnteredPassword: vi.fn().mockResolvedValue(false)
  })
}));

vi.mock('../useAdminSetup', () => ({
  useAdminSetup: () => ({
    attemptAdminAccountSetup: vi.fn().mockResolvedValue(false)
  })
}));

vi.mock('../useLoginNotifications', () => ({
  useLoginNotifications: () => ({
    handleInvalidEmail: vi.fn(),
    handleAllLoginAttemptsFailed: vi.fn()
  })
}));

describe('useAdminLoginFlow', () => {
  const mockAuthService = createMockAuthService();
  const setErrorMessage = createMockSetState();
  const setIsLoading = createMockSetState();
  const setIsCreatingAdmin = createMockSetState();
  const onLoginSuccess = vi.fn();
  const mockEvent = createMockFormEvent();
  
  const mockProps = {
    email: 'admin@example.com',
    password: 'password123',
    ADMIN_EMAIL: 'admin@example.com',
    DEFAULT_ADMIN_PASSWORD: 'default123',
    setIsLoading,
    setIsCreatingAdmin,
    setErrorMessage,
    authService: mockAuthService,
    onLoginSuccess
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should handle login process correctly', async () => {
    const { result } = renderHook(() => useAdminLoginFlow(mockProps));
    
    await result.current.handleLogin(mockEvent);
    
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(setIsLoading).toHaveBeenCalledWith(true);
    expect(setErrorMessage).toHaveBeenCalledWith('');
    expect(setIsLoading).toHaveBeenCalledWith(false);
  });
  
  it('should handle login process for non-admin email correctly', async () => {
    const { result } = renderHook(() => useAdminLoginFlow({
      ...mockProps,
      email: 'user@example.com'
    }));
    
    await result.current.handleLogin(mockEvent);
    
    expect(setIsLoading).toHaveBeenCalledWith(true);
    expect(setIsLoading).toHaveBeenCalledWith(false);
  });
  
  it('should handle login errors gracefully', async () => {
    // Mock the function to throw an error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Force an error in the function
    const loginMock = vi.fn().mockImplementation(() => {
      throw new Error('Test error');
    });
    
    vi.mock('../useLoginAttempts', () => ({
      useLoginAttempts: () => ({
        attemptLoginWithDefaultPassword: loginMock,
        attemptLoginWithEnteredPassword: vi.fn().mockResolvedValue(false)
      })
    }));
    
    const { result } = renderHook(() => useAdminLoginFlow(mockProps));
    
    await result.current.handleLogin(mockEvent);
    
    expect(setErrorMessage).toHaveBeenCalledWith('An unexpected error occurred during login');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
