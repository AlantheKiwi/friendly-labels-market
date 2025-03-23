import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuthService } from "./useAuthService";
import { ADMIN_EMAIL } from "@/services/auth/constants";

export const useAuthOperations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const authService = useAuthService();

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting sign in for:", email);
      const { error } = await authService.signInWithPassword(email, password);
      
      if (error) {
        console.error("Sign in error:", error.message);
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Signed in successfully",
        description: "Welcome back!",
      });
      
      const { data } = await supabase.auth.getUser();
      
      if (data.user) {
        console.log("User authenticated:", data.user.id);
        
        // Direct admin check by email - for faster login experience
        if (data.user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
          console.log("Admin email match found - bypassing role check and redirecting to admin dashboard");
          navigate("/admin/dashboard", { replace: true });
          return;
        }
        
        try {
          const roles = await authService.checkUserRoles(data.user.id);
          
          console.log("User roles determined:", roles);
          
          if (roles.isAdmin) {
            console.log("User is an admin, redirecting to admin dashboard");
            navigate("/admin/dashboard", { replace: true });
          } else if (roles.isClient) {
            console.log("User is a client, redirecting to client dashboard");
            navigate("/client/dashboard", { replace: true });
          } else {
            console.log("User has no specific role, redirecting to home");
            navigate("/");
          }
        } catch (error) {
          console.error("Error checking roles:", error);
          navigate("/");
        }
      } else {
        console.log("No user data available, redirecting to home");
        navigate("/");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { error } = await authService.signUp(email, password, userData);
      
      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Account created",
        description: "Please check your email to verify your account",
      });
      
      navigate("/auth/login");
    } catch (error) {
      console.error("Sign up error:", error);
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      console.log("useAuthOperations - Signing out user");
      
      const { error } = await authService.signOut();
      
      if (error) {
        console.error("Sign out error:", error);
        throw error;
      }
      
      localStorage.removeItem("supabase.auth.token");
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out",
      });
      
      window.location.href = "/";
      
      console.log("useAuthOperations - Sign out successful, navigated to home page");
      return Promise.resolve();
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Sign out failed",
        description: "There was an error signing out. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };

  return { signIn, signUp, signOut };
};
