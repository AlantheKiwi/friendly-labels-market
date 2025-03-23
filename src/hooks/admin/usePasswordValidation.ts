
import { useState } from "react";

export const usePasswordValidation = () => {
  const [passwordDetails, setPasswordDetails] = useState<any>(null);

  // Helper to compare passwords and detect issues
  const comparePasswords = (input: string, expected: string) => {
    if (input === expected) return true;
    
    // If not an exact match, log details to help debug
    console.log("Password comparison failed. Details:");
    console.log("Input length:", input.length, "Expected length:", expected.length);
    console.log("Input first/last chars:", input.charAt(0), input.charAt(input.length-1));
    console.log("Expected first/last chars:", expected.charAt(0), expected.charAt(expected.length-1));
    
    // Check for whitespace issues
    if (input.trim() === expected || input === expected.trim()) {
      console.log("Password match failed due to whitespace");
    }
    
    // Check for case sensitivity issues
    if (input.toLowerCase() === expected.toLowerCase()) {
      console.log("Password match failed due to case sensitivity");
    }
    
    // Check for special character encoding
    const inputCodes = Array.from(input).map(c => c.charCodeAt(0));
    const expectedCodes = Array.from(expected).map(c => c.charCodeAt(0));
    console.log("Input char codes:", inputCodes);
    console.log("Expected char codes:", expectedCodes);
    
    // Store detailed information for use in UI if needed
    setPasswordDetails({
      matching: false,
      inputLength: input.length,
      expectedLength: expected.length,
      whitespaceIssue: input.trim() === expected || input === expected.trim(),
      caseIssue: input.toLowerCase() === expected.toLowerCase(),
      inputCodes,
      expectedCodes
    });
    
    return false;
  };

  return { comparePasswords, passwordDetails };
};
