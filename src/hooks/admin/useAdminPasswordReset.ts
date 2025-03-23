
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UseAdminPasswordResetProps {
  email: string;
  ADMIN_EMAIL: string;
  setIsLoading: (isLoading: boolean) => void;
  setErrorMessage: (errorMessage: string) => void;
}

export const useAdminPasswordReset = ({
  email,
  ADMIN_EMAIL,
  setIsLoading,
  setErrorMessage
}: UseAdminPasswordResetProps) => {
  const { toast } = useToast();

  const validateEmailForReset = () => {
    if (!email) {
      setErrorMessage("Please enter your email address first");
      toast({
        title: "Email required",
        description: "Please enter your email address before requesting a password reset",
        variant: "destructive",
      });
      return false;
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (normalizedEmail !== ADMIN_EMAIL.toLowerCase().trim()) {
      setErrorMessage("Password reset is only available for administrator accounts");
      toast({
        title: "Access denied",
        description: "Password reset is only available for administrator accounts",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const sendPasswordResetEmail = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(ADMIN_EMAIL, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });
      
      if (error) {
        console.error("Password reset error:", error.message);
        setErrorMessage(error.message);
        toast({
          title: "Password reset failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      } else {
        setErrorMessage("");
        toast({
          title: "Password reset email sent",
          description: "Check your email for a password reset link",
        });
        return true;
      }
    } catch (err) {
      console.error("Password reset error:", err);
      setErrorMessage("An unexpected error occurred during password reset");
      toast({
        title: "Password reset failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    validateEmailForReset,
    sendPasswordResetEmail
  };
};
