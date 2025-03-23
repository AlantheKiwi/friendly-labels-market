
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

  const attemptLoginWithDefaultPassword = async () => {
    console.log("Trying login with default password:", DEFAULT_ADMIN_PASSWORD.replace(/./g, "*"));
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
    
    console.log("Login with default password failed");
    return false;
  };

  const attemptLoginWithEnteredPassword = async () => {
    if (password === DEFAULT_ADMIN_PASSWORD) {
      return false; // No need to try the same password twice
    }
    
    console.log("Trying login with entered password");
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
    return false;
  };

  const attemptAdminAccountSetup = async () => {
    console.log("Starting admin account setup process");
    setIsCreatingAdmin(true);
    
    const { data, error } = await authService.createAdminIfNotExists();
    
    setIsCreatingAdmin(false);
    
    if (error) {
      console.error("Admin setup failed:", error.message);
      setErrorMessage(error.message);
      toast({
        title: "Admin setup failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
    
    if (data) {
      console.log("Admin setup successful");
      await authService.checkUserRoles(data.user.id);
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard. Please update your password.",
      });
      localStorage.setItem("requirePasswordChange", "true");
      onLoginSuccess();
      return true;
    }
    
    return false;
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
    handleInvalidEmail,
    handleAllLoginAttemptsFailed
  };
};
