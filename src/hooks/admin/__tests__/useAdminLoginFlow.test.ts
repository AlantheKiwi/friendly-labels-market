
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
    handleAllLoginAttemptsFailed: vi.fn(),
    handleNetworkError: vi.fn(),
    handleAuthenticationError: vi.fn(),
    handleUnexpectedError: vi.fn()
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
  
  it('should handle network errors gracefully', async () => {
    // Mock the login attempt to throw a network error
    const networkError = new Error('Network connection failed');
    networkError.message = 'network connection failed';
    
    vi.mock('../useLoginAttempts', () => ({
      useLoginAttempts: () => ({
        attemptLoginWithDefaultPassword: vi.fn().mockRejectedValue(networkError),
        attemptLoginWithEnteredPassword: vi.fn().mockResolvedValue(false)
      })
    }));
    
    const { result } = renderHook(() => useAdminLoginFlow(mockProps));
    
    await result.current.handleLogin(mockEvent);
    
    expect(setIsLoading).toHaveBeenCalledWith(false);
  });
  
  it('should handle authentication errors gracefully', async () => {
    // Mock the login attempt to throw an authentication error
    const authError = new Error('Invalid credentials');
    authError.message = 'credentials are invalid';
    
    vi.mock('../useLoginAttempts', () => ({
      useLoginAttempts: () => ({
        attemptLoginWithDefaultPassword: vi.fn().mockRejectedValue(authError),
        attemptLoginWithEnteredPassword: vi.fn().mockResolvedValue(false)
      })
    }));
    
    const { result } = renderHook(() => useAdminLoginFlow(mockProps));
    
    await result.current.handleLogin(mockEvent);
    
    expect(setIsLoading).toHaveBeenCalledWith(false);
  });
  
  it('should handle general unexpected errors', async () => {
    // Mock the function to throw a general error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Force an error in the function
    const unexpectedError = new Error('Test error');
    
    vi.mock('../useLoginNotifications', () => ({
      useLoginNotifications: () => ({
        handleInvalidEmail: vi.fn(),
        handleAllLoginAttemptsFailed: vi.fn(),
        handleNetworkError: vi.fn(),
        handleAuthenticationError: vi.fn(),
        handleUnexpectedError: vi.fn().mockImplementation(() => {
          throw unexpectedError;
        })
      })
    }));
    
    const { result } = renderHook(() => useAdminLoginFlow(mockProps));
    
    await result.current.handleLogin(mockEvent);
    
    expect(setIsLoading).toHaveBeenCalledWith(false);
    consoleSpy.mockRestore();
  });
});
