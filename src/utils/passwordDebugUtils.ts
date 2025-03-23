
/**
 * Utility to help debug password encoding/character issues
 */
export const analyzePassword = (password: string) => {
  return {
    length: password.length,
    hasWhitespace: /\s/.test(password),
    hasLeadingWhitespace: password !== password.trimStart(),
    hasTrailingWhitespace: password !== password.trimEnd(),
    hasSpecialChars: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    specialChars: Array.from(password).filter(char => /[!@#$%^&*(),.?":{}|<>]/.test(char)),
    charCodes: Array.from(password).map(c => c.charCodeAt(0)),
    isCopyPasteFriendly: !/[\u00A0\u2007\u202F]/.test(password), // Check for non-breaking spaces
  };
};

/**
 * Check if the default password in constants.ts has any encoding issues
 */
export const checkDefaultPasswordEncoding = (defaultPassword: string) => {
  const analysis = analyzePassword(defaultPassword);
  console.log("Default password analysis:", analysis);
  
  // Look for potential issues
  const issues = [];
  
  if (!analysis.isCopyPasteFriendly) {
    issues.push("Contains non-breaking spaces or other invisible characters");
  }
  
  if (analysis.hasLeadingWhitespace || analysis.hasTrailingWhitespace) {
    issues.push("Contains leading or trailing whitespace");
  }
  
  // Check for unusual character codes
  const unusualCodes = analysis.charCodes.filter(code => 
    (code < 32) || (code > 126 && code < 160) || (code > 255)
  );
  
  if (unusualCodes.length > 0) {
    issues.push(`Contains unusual character codes: ${unusualCodes.join(', ')}`);
  }
  
  return {
    analysis,
    hasIssues: issues.length > 0,
    issues
  };
};
