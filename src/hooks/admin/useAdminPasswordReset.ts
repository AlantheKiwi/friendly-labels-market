
import { useToast } from "@/components/ui/use-toast";

interface UseAdminPasswordResetProps {
  email: string;
  ADMIN_EMAIL: string;
  setIsLoading: (isLoading: boolean) => void;
  setErrorMessage: (message: string) => void;
  authService: any;
}

export const useAdminPasswordReset = ({
  email,
  ADMIN_EMAIL,
  setIsLoading,
  setErrorMessage,
  authService
}: UseAdminPasswordResetProps) => {
  const { toast } = useToast();

  const validateEmailForReset = () => {
    const normalizedEmail = email.toLowerCase().trim();
    const adminEmail = ADMIN_EMAIL.toLowerCase().trim();
    
    if (normalizedEmail !== adminEmail) {
      toast({
        title: "Invalid email",
        description: "Please enter the admin email address for password reset",
        variant: "destructive",
      });
      setErrorMessage("Please enter the admin email address for password reset");
      return false;
    }
    
    return true;
  };

  const sendPasswordResetEmail = async () => {
    console.log("Sending password reset email to:", email);
    
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
      
      console.log("Password reset email sent successfully");
      toast({
        title: "Password reset email sent",
        description: "Please check your email inbox",
      });
      return true;
    } catch (err: any) {
      console.error("Unexpected error during password reset:", err);
      setErrorMessage("An unexpected error occurred during password reset");
      toast({
        title: "Password reset failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
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

  return {
    validateEmailForReset,
    sendPasswordResetEmail,
    resetAdminPassword
  };
};
