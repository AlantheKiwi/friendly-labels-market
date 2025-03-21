
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { checkUserRoles } from "./useRoleCheck";

export const useAuthOperations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting sign in for:", email);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
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
      
      // Get user roles after sign in to determine redirect
      const { data } = await supabase.auth.getUser();
      
      if (data.user) {
        console.log("User authenticated, checking roles for:", data.user.id);
        try {
          const roles = await checkUserRoles(data.user.id);
          
          console.log("Roles determined:", roles);
          
          // Redirect based on roles
          if (roles.isClient) {
            console.log("Redirecting client to dashboard");
            navigate("/client/dashboard", { replace: true });
          } else if (roles.isAdmin) {
            console.log("Redirecting admin to dashboard");
            navigate("/admin/dashboard", { replace: true });
          } else {
            console.log("No specific role, redirecting to home");
            navigate("/");
          }
        } catch (error) {
          console.error("Error checking roles:", error);
          navigate("/");
        }
      } else {
        console.log("No user data, redirecting to home");
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
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
      // First clear any local state before signout
      console.log("Signing out user");
      
      // Make sure to await the signOut operation
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error);
        throw error;
      }
      
      // Clear any user state and navigate to home page
      console.log("Successfully signed out, redirecting to home");
      navigate("/", { replace: true });
      
      // Return nothing to match the Promise<void> type
      return Promise.resolve();
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  return { signIn, signUp, signOut };
};
