
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuthService } from "@/hooks/useAuthService";
import { supabase } from "@/integrations/supabase/client";

export const useAdminLogin = (onLoginSuccess: () => void) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();
  const authService = useAuthService();
  
  // Get these values directly from the service for consistency
  const DEFAULT_ADMIN_PASSWORD = authService.DEFAULT_ADMIN_PASSWORD;
  const ADMIN_EMAIL = authService.ADMIN_EMAIL;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      console.log("Starting admin login process with email:", email);
      
      // Normalize email to lowercase for consistency
      const normalizedEmail = email.toLowerCase().trim();
      
      // Check if this is the admin email
      const isAdminEmail = normalizedEmail === ADMIN_EMAIL.toLowerCase().trim();
      
      if (isAdminEmail) {
        console.log("Admin login attempt detected");
        
        // First try with entered password
        console.log("Trying login with provided password:", password);
        const { data, error } = await authService.signInWithPassword(
          ADMIN_EMAIL, // Always use the exact admin email
          password
        );
        
        if (!error) {
          // Direct login successful
          console.log("Admin login successful with entered password");
          await authService.checkUserRoles(data.user.id);
          toast({
            title: "Login successful",
            description: "Welcome to the admin dashboard",
          });
          onLoginSuccess();
          setIsLoading(false);
          return;
        }
        
        console.log("Login with entered password failed:", error.message);
        
        // If standard login failed, try the admin setup process
        console.log("Starting admin account setup process");
        setIsCreatingAdmin(true);
        
        const { data: adminData, error: setupError } = await authService.createAdminIfNotExists();
        
        setIsCreatingAdmin(false);
        
        if (setupError) {
          console.error("Admin setup failed:", setupError.message);
          setErrorMessage(setupError.message);
          toast({
            title: "Admin setup failed",
            description: setupError.message,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        if (adminData) {
          // Admin was created or we got logged in
          console.log("Admin setup successful");
          await authService.checkUserRoles(adminData.user.id);
          toast({
            title: "Login successful",
            description: "Welcome to the admin dashboard. Please update your password.",
          });
          localStorage.setItem("requirePasswordChange", "true");
          onLoginSuccess();
          setIsLoading(false);
          return;
        }
        
        // If we get here, all attempts failed
        setErrorMessage(`Could not log in. Please try again with the default password: ${DEFAULT_ADMIN_PASSWORD}`);
        toast({
          title: "Login failed",
          description: `Could not log in. Please try with the default password: ${DEFAULT_ADMIN_PASSWORD}`,
          variant: "destructive",
        });
      } else {
        // Not the admin email - reject
        setErrorMessage("You do not have administrator privileges");
        toast({
          title: "Access denied",
          description: "You do not have administrator privileges",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage("An unexpected error occurred during login");
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSetDefaultValues = () => {
    setEmail(ADMIN_EMAIL);
    setPassword(DEFAULT_ADMIN_PASSWORD);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setErrorMessage("Please enter your email address first");
      toast({
        title: "Email required",
        description: "Please enter your email address before requesting a password reset",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Normalize email to lowercase for consistency
      const normalizedEmail = email.toLowerCase().trim();
      
      // Only allow password reset for the admin email
      if (normalizedEmail !== ADMIN_EMAIL.toLowerCase().trim()) {
        setErrorMessage("Password reset is only available for administrator accounts");
        toast({
          title: "Access denied",
          description: "Password reset is only available for administrator accounts",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
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
      } else {
        setErrorMessage("");
        toast({
          title: "Password reset email sent",
          description: "Check your email for a password reset link",
        });
      }
    } catch (err) {
      console.error("Password reset error:", err);
      setErrorMessage("An unexpected error occurred during password reset");
      toast({
        title: "Password reset failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    isLoading,
    isCreatingAdmin,
    errorMessage,
    DEFAULT_ADMIN_PASSWORD,
    ADMIN_EMAIL,
    handleLogin,
    toggleShowPassword,
    handleSetDefaultValues,
    handleForgotPassword
  };
};
