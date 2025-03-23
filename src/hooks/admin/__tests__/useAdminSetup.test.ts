
import { renderHook } from '@testing-library/react-hooks';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAdminSetup } from '../useAdminSetup';
import { createMockAuthService, createMockSetState, createMockToast } from './authTestUtils';

// Mock the useToast hook
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => createMockToast()
}));

describe('useAdminSetup', () => {
  const mockAuthService = createMockAuthService();
  const setErrorMessage = createMockSetState();
  const setIsCreatingAdmin = createMockSetState();
  const onLoginSuccess = vi.fn();
  
  const mockProps = {
    ADMIN_EMAIL: 'admin@example.com',
    setIsCreatingAdmin,
    setErrorMessage,
    authService: mockAuthService,
    onLoginSuccess
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage for testing
    vi.spyOn(Storage.prototype, 'setItem');
  });
  
  it('should attempt admin account setup successfully', async () => {
    mockAuthService.createAdminIfNotExists.mockResolvedValue({
      data: { user: { id: '123' } },
      error: null
    });
    mockAuthService.checkUserRoles.mockResolvedValue({});
    
    const { result } = renderHook(() => useAdminSetup(mockProps));
    
    const success = await result.current.attemptAdminAccountSetup();
    
    expect(success).toBe(true);
    expect(setIsCreatingAdmin).toHaveBeenCalledWith(true);
    expect(setIsCreatingAdmin).toHaveBeenCalledWith(false);
    expect(mockAuthService.createAdminIfNotExists).toHaveBeenCalled();
    expect(mockAuthService.checkUserRoles).toHaveBeenCalled();
    expect(localStorage.setItem).toHaveBeenCalledWith('requirePasswordChange', 'true');
    expect(onLoginSuccess).toHaveBeenCalled();
  });
  
  it('should handle admin account setup failure', async () => {
    mockAuthService.createAdminIfNotExists.mockResolvedValue({
      data: null,
      error: { message: 'Failed to create admin' }
    });
    
    const { result } = renderHook(() => useAdminSetup(mockProps));
    
    const success = await result.current.attemptAdminAccountSetup();
    
    expect(success).toBe(false);
    expect(setIsCreatingAdmin).toHaveBeenCalledWith(true);
    expect(setIsCreatingAdmin).toHaveBeenCalledWith(false);
    expect(setErrorMessage).toHaveBeenCalledWith('Failed to create admin');
    expect(onLoginSuccess).not.toHaveBeenCalled();
  });
  
  it('should handle empty response from admin account setup', async () => {
    mockAuthService.createAdminIfNotExists.mockResolvedValue({
      data: null,
      error: null
    });
    
    const { result } = renderHook(() => useAdminSetup(mockProps));
    
    const success = await result.current.attemptAdminAccountSetup();
    
    expect(success).toBe(false);
    expect(setIsCreatingAdmin).toHaveBeenCalledWith(true);
    expect(setIsCreatingAdmin).toHaveBeenCalledWith(false);
  });
});
