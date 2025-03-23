
import { useToast } from "@/components/ui/use-toast";

interface UseLoginAttemptsProps {
  email: string;
  password: string;
  ADMIN_EMAIL: string;
  DEFAULT_ADMIN_PASSWORD: string;
  setIsLoading: (isLoading: boolean) => void;
  setErrorMessage: (errorMessage: string) => void;
  authService: any;
  onLoginSuccess: () => void;
  comparePasswords: (input: string, expected: string) => boolean;
}

export const useLoginAttempts = ({
  email,
  password,
  ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
  setIsLoading,
  setErrorMessage,
  authService,
  onLoginSuccess,
  comparePasswords
}: UseLoginAttemptsProps) => {
  const { toast } = useToast();

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

  return {
    attemptLoginWithDefaultPassword,
    attemptLoginWithEnteredPassword
  };
};
