
import { useToast } from "@/components/ui/use-toast";

interface UseAdminSetupProps {
  ADMIN_EMAIL: string;
  setIsCreatingAdmin: (isCreating: boolean) => void;
  setErrorMessage: (message: string) => void;
  authService: any;
  onLoginSuccess: () => void;
}

export const useAdminSetup = ({
  ADMIN_EMAIL,
  setIsCreatingAdmin,
  setErrorMessage,
  authService,
  onLoginSuccess
}: UseAdminSetupProps) => {
  const { toast } = useToast();

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

  return { attemptAdminAccountSetup };
};
