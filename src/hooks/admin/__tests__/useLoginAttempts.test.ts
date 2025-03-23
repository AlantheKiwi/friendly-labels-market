
import { renderHook } from '@testing-library/react-hooks';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLoginAttempts } from '../useLoginAttempts';
import { createMockAuthService, createMockSetState, createMockToast } from './authTestUtils';

// Mock the useToast hook
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => createMockToast()
}));

describe('useLoginAttempts', () => {
  const mockAuthService = createMockAuthService();
  const onLoginSuccess = vi.fn();
  const comparePasswords = vi.fn().mockReturnValue(true);
  const setErrorMessage = createMockSetState();
  const setIsLoading = createMockSetState();
  
  const mockProps = {
    email: 'test@example.com',
    password: 'password123',
    ADMIN_EMAIL: 'admin@example.com',
    DEFAULT_ADMIN_PASSWORD: 'default123',
    setIsLoading,
    setErrorMessage,
    authService: mockAuthService,
    onLoginSuccess,
    comparePasswords
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should attempt login with default password successfully', async () => {
    mockAuthService.signInWithPassword.mockResolvedValue({
      data: { user: { id: '123' } },
      error: null
    });
    mockAuthService.checkUserRoles.mockResolvedValue({});
    
    const { result } = renderHook(() => useLoginAttempts(mockProps));
    
    const success = await result.current.attemptLoginWithDefaultPassword();
    
    expect(success).toBe(true);
    expect(mockAuthService.signInWithPassword).toHaveBeenCalledWith(
      mockProps.ADMIN_EMAIL,
      mockProps.DEFAULT_ADMIN_PASSWORD
    );
    expect(onLoginSuccess).toHaveBeenCalled();
  });
  
  it('should attempt login with default password and fail', async () => {
    mockAuthService.signInWithPassword.mockResolvedValue({
      data: null,
      error: { message: 'Invalid login credentials' }
    });
    
    const { result } = renderHook(() => useLoginAttempts(mockProps));
    
    const success = await result.current.attemptLoginWithDefaultPassword();
    
    expect(success).toBe(false);
    expect(mockAuthService.signInWithPassword).toHaveBeenCalledWith(
      mockProps.ADMIN_EMAIL,
      mockProps.DEFAULT_ADMIN_PASSWORD
    );
    expect(onLoginSuccess).not.toHaveBeenCalled();
  });
  
  it('should attempt login with entered password successfully', async () => {
    mockAuthService.signInWithPassword.mockResolvedValue({
      data: { user: { id: '123' } },
      error: null
    });
    mockAuthService.checkUserRoles.mockResolvedValue({});
    
    const { result } = renderHook(() => useLoginAttempts({
      ...mockProps,
      password: 'user-password' // Different from default
    }));
    
    const success = await result.current.attemptLoginWithEnteredPassword();
    
    expect(success).toBe(true);
    expect(mockAuthService.signInWithPassword).toHaveBeenCalledWith(
      mockProps.ADMIN_EMAIL,
      'user-password'
    );
    expect(onLoginSuccess).toHaveBeenCalled();
  });
  
  it('should skip login attempt when password is the same as default', async () => {
    const { result } = renderHook(() => useLoginAttempts({
      ...mockProps,
      password: mockProps.DEFAULT_ADMIN_PASSWORD // Same as default
    }));
    
    const success = await result.current.attemptLoginWithEnteredPassword();
    
    expect(success).toBe(false);
    expect(mockAuthService.signInWithPassword).not.toHaveBeenCalled();
  });
});
