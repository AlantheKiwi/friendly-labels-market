
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

  it('should handle network error notification', () => {
    const { result } = renderHook(() => useLoginNotifications(mockProps));
    const mockError = new Error('Network error');
    
    result.current.handleNetworkError(mockError);
    
    expect(mockProps.setErrorMessage).toHaveBeenCalledWith(
      'Connection error. Please check your internet connection and try again.'
    );
  });

  it('should handle authentication error notification', () => {
    const { result } = renderHook(() => useLoginNotifications(mockProps));
    const errorMessage = 'Invalid credentials';
    
    result.current.handleAuthenticationError(errorMessage);
    
    expect(mockProps.setErrorMessage).toHaveBeenCalledWith(
      `Authentication error: ${errorMessage}`
    );
  });

  it('should handle unexpected error notification', () => {
    const { result } = renderHook(() => useLoginNotifications(mockProps));
    const mockError = new Error('Unexpected error');
    
    result.current.handleUnexpectedError(mockError);
    
    expect(mockProps.setErrorMessage).toHaveBeenCalledWith(
      `An unexpected error occurred: Unexpected error`
    );
  });

  it('should handle unknown error type in unexpected error', () => {
    const { result } = renderHook(() => useLoginNotifications(mockProps));
    const unknownError = { custom: 'error' };
    
    result.current.handleUnexpectedError(unknownError);
    
    expect(mockProps.setErrorMessage).toHaveBeenCalledWith(
      `An unexpected error occurred: An unknown error occurred`
    );
  });
});
