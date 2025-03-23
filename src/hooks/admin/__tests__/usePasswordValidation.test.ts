
import { renderHook, act } from '@testing-library/react-hooks';
import { describe, it, expect } from 'vitest';
import { usePasswordValidation } from '../usePasswordValidation';

describe('usePasswordValidation', () => {
  it('should compare passwords correctly when they match', () => {
    const { result } = renderHook(() => usePasswordValidation());
    
    let isMatch;
    act(() => {
      isMatch = result.current.comparePasswords('test123', 'test123');
    });
    
    expect(isMatch).toBe(true);
  });
  
  it('should compare passwords correctly when they do not match', () => {
    const { result } = renderHook(() => usePasswordValidation());
    
    let isMatch;
    act(() => {
      isMatch = result.current.comparePasswords('test123', 'test456');
    });
    
    expect(isMatch).toBe(false);
  });
  
  it('should set password details when passwords do not match', () => {
    const { result } = renderHook(() => usePasswordValidation());
    
    act(() => {
      result.current.comparePasswords('test123', 'test456');
    });
    
    expect(result.current.passwordDetails).not.toBeNull();
    expect(result.current.passwordDetails.matching).toBe(false);
  });
  
  it('should detect whitespace issues', () => {
    const { result } = renderHook(() => usePasswordValidation());
    
    act(() => {
      result.current.comparePasswords('test123 ', 'test123');
    });
    
    expect(result.current.passwordDetails.whitespaceIssue).toBe(true);
  });
  
  it('should detect case sensitivity issues', () => {
    const { result } = renderHook(() => usePasswordValidation());
    
    act(() => {
      result.current.comparePasswords('Test123', 'test123');
    });
    
    expect(result.current.passwordDetails.caseIssue).toBe(true);
  });
});
