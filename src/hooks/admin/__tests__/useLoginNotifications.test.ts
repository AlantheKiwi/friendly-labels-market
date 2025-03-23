
import { renderHook } from '@testing-library/react-hooks';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLoginNotifications } from '../useLoginNotifications';
import { createMockToast, createMockSetState } from './authTestUtils';

// Mock the useToast hook
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => createMockToast()
}));

describe('useLoginNotifications', () => {
  const mockProps = {
    email: 'test@example.com',
    ADMIN_EMAIL: 'admin@example.com',
    DEFAULT_ADMIN_PASSWORD: 'password123',
    setErrorMessage: createMockSetState()
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should handle invalid email notification', () => {
    const { result } = renderHook(() => useLoginNotifications(mockProps));
    
    result.current.handleInvalidEmail();
    
    expect(mockProps.setErrorMessage).toHaveBeenCalledWith('You do not have administrator privileges');
  });
  
  it('should handle all login attempts failed notification', () => {
    const { result } = renderHook(() => useLoginNotifications(mockProps));
    
    result.current.handleAllLoginAttemptsFailed();
    
    expect(mockProps.setErrorMessage).toHaveBeenCalledWith(
      `Could not log in. Please try again with the default password: ${mockProps.DEFAULT_ADMIN_PASSWORD}`
    );
  });
});
