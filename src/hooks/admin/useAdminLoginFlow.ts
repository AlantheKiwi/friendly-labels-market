
import { useToast } from "@/components/ui/use-toast";

interface UseAdminLoginFlowProps {
  email: string;
  password: string;
  ADMIN_EMAIL: string;
  DEFAULT_ADMIN_PASSWORD: string;
  setIsLoading: (isLoading: boolean) => void;
  setIsCreatingAdmin: (isCreatingAdmin: boolean) => void;
  setErrorMessage: (errorMessage: string) => void;
  authService: any; // Using any here since we don't have the exact type definition
  onLoginSuccess: () => void;
}

export const useAdminLoginFlow = ({
  email,
  password,
  ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
  setIsLoading,
  setIsCreatingAdmin,
  setErrorMessage,
  authService,
  onLoginSuccess
}: UseAdminLoginFlowProps) => {
  const { toast } = useToast();

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
    
    return false;
  };

  const attemptLoginWithDefaultPassword = async () => {
    console.log("Trying login with default password:", DEFAULT_ADMIN_PASSWORD.replace(/./g, "*"));
    // Log both credentials to verify what we're attempting to use
    console.log("Admin email being used:", ADMIN_EMAIL);
    console.log("Input validation - Email matches admin email:", email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim());
    
    // Extra validation for password
    comparePasswords(password, DEFAULT_ADMIN_PASSWORD);
    
    const { data, error } = await authService.signInWithPassword(
      ADMIN_EMAIL,
      DEFAULT_ADMIN_PASSWORD
    );
    
    if (!error) {
      console.log("Admin login successful with default password");
      await authService.checkUserRoles(data.user.id);
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard. Using default password.",
      });
      localStorage.setItem("requirePasswordChange", "true");
      onLoginSuccess();
      return true;
    }
    
    console.log("Login with default password failed:", error.message);
    return false;
  };

  const attemptLoginWithEnteredPassword = async () => {
    if (password === DEFAULT_ADMIN_PASSWORD) {
      console.log("Entered password is the same as default, skipping duplicate attempt");
      return false; // No need to try the same password twice
    }
    
    console.log("Trying login with entered password");
    console.log("Admin email being used:", ADMIN_EMAIL);
    
    const { data, error } = await authService.signInWithPassword(
      ADMIN_EMAIL,
      password
    );
    
    if (!error) {
      console.log("Admin login successful with entered password");
      await authService.checkUserRoles(data.user.id);
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard",
      });
      onLoginSuccess();
      return true;
    }
    
    console.log("Login with entered password failed:", error.message);
    console.log("Error object details:", JSON.stringify(error, null, 2));
    return false;
  };

  const attemptAdminAccountSetup = async () => {
    console.log("Starting admin account setup process");
    setIsCreatingAdmin(true);
    
    // Log createAdminIfNotExists parameters to ensure it's receiving what we expect
    console.log("Creating admin with email:", ADMIN_EMAIL);
    
    const { data, error } = await authService.createAdminIfNotExists();
    
    setIsCreatingAdmin(false);
    
    if (error) {
      console.error("Admin setup failed:", error.message);
      console.error("Full error object:", JSON.stringify(error, null, 2));
      setErrorMessage(error.message);
      toast({
        title: "Admin setup failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
    
    if (data) {
      console.log("Admin setup successful, user data:", JSON.stringify(data, null, 2));
      await authService.checkUserRoles(data.user.id);
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard. Please update your password.",
      });
      localStorage.setItem("requirePasswordChange", "true");
      onLoginSuccess();
      return true;
    }
    
    console.log("Admin setup did not return data or error");
    return false;
  };

  const resetAdminPassword = async () => {
    console.log("Attempting to reset admin password to default");
    setIsLoading(true);
    
    try {
      const { data, error } = await authService.resetAdminPassword();
      
      if (error) {
        console.error("Password reset failed:", error.message);
        setErrorMessage("Password reset failed: " + error.message);
        toast({
          title: "Password reset failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      
      console.log("Password reset response:", data);
      setErrorMessage("");
      toast({
        title: "Password reset action completed",
        description: data.message || "Please check your email or try the default password.",
      });
      return true;
    } catch (err) {
      console.error("Unexpected error during password reset:", err);
      setErrorMessage("An unexpected error occurred during password reset");
      toast({
        title: "Password reset failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvalidEmail = () => {
    setErrorMessage("You do not have administrator privileges");
    toast({
      title: "Access denied",
      description: "You do not have administrator privileges",
      variant: "destructive",
    });
  };

  const handleAllLoginAttemptsFailed = () => {
    // Log details about what we know at this point
    console.log("All login attempts failed with email:", email);
    console.log("Default admin email:", ADMIN_EMAIL);
    console.log("Default admin password:", DEFAULT_ADMIN_PASSWORD.replace(/./g, "*"));
    
    setErrorMessage(`Could not log in. Please try again with the default password: ${DEFAULT_ADMIN_PASSWORD}`);
    toast({
      title: "Login failed",
      description: `Could not log in. Please try with the default password: ${DEFAULT_ADMIN_PASSWORD}`,
      variant: "destructive",
    });
  };

  return {
    attemptLoginWithDefaultPassword,
    attemptLoginWithEnteredPassword,
    attemptAdminAccountSetup,
    resetAdminPassword,
    handleInvalidEmail,
    handleAllLoginAttemptsFailed
  };
};
