
import { renderHook } from '@testing-library/react-hooks';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAdminPasswordReset } from '../useAdminPasswordReset';
import { createMockAuthService, createMockSetState, createMockToast } from './authTestUtils';

// Mock the useToast hook
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => createMockToast()
}));

describe('useAdminPasswordReset', () => {
  const mockAuthService = createMockAuthService();
  const setErrorMessage = createMockSetState();
  const setIsLoading = createMockSetState();
  
  const mockProps = {
    email: 'admin@example.com',
    ADMIN_EMAIL: 'admin@example.com',
    setIsLoading,
    setErrorMessage,
    authService: mockAuthService
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should validate email for reset correctly - success case', () => {
    const { result } = renderHook(() => useAdminPasswordReset(mockProps));
    
    const isValid = result.current.validateEmailForReset();
    
    expect(isValid).toBe(true);
    expect(setErrorMessage).not.toHaveBeenCalled();
  });
  
  it('should validate email for reset correctly - failure case', () => {
    const { result } = renderHook(() => useAdminPasswordReset({
      ...mockProps,
      email: 'wrong@example.com'
    }));
    
    const isValid = result.current.validateEmailForReset();
    
    expect(isValid).toBe(false);
    expect(setErrorMessage).toHaveBeenCalledWith('Please enter the admin email address for password reset');
  });
  
  it('should send password reset email successfully', async () => {
    mockAuthService.resetAdminPassword.mockResolvedValue({
      data: { message: 'Password reset email sent' },
      error: null
    });
    
    const { result } = renderHook(() => useAdminPasswordReset(mockProps));
    
    const success = await result.current.sendPasswordResetEmail();
    
    expect(success).toBe(true);
    expect(mockAuthService.resetAdminPassword).toHaveBeenCalled();
  });
  
  it('should handle errors when sending password reset email', async () => {
    mockAuthService.resetAdminPassword.mockResolvedValue({
      data: null,
      error: { message: 'Failed to send reset email' }
    });
    
    const { result } = renderHook(() => useAdminPasswordReset(mockProps));
    
    const success = await result.current.sendPasswordResetEmail();
    
    expect(success).toBe(false);
    expect(setErrorMessage).toHaveBeenCalledWith('Password reset failed: Failed to send reset email');
  });
  
  it('should reset admin password successfully', async () => {
    mockAuthService.resetAdminPassword.mockResolvedValue({
      data: { message: 'Password has been reset' },
      error: null
    });
    
    const { result } = renderHook(() => useAdminPasswordReset(mockProps));
    
    const success = await result.current.resetAdminPassword();
    
    expect(success).toBe(true);
    expect(setIsLoading).toHaveBeenCalledWith(true);
    expect(setIsLoading).toHaveBeenCalledWith(false);
    expect(mockAuthService.resetAdminPassword).toHaveBeenCalled();
  });
});
