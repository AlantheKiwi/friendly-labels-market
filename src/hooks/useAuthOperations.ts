
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
      
      // Get user data after successful sign in
      const { data } = await supabase.auth.getUser();
      
      if (data.user) {
        console.log("User authenticated:", data.user.id);
        try {
          // Check user roles to determine where to redirect
          const roles = await checkUserRoles(data.user.id);
          
          console.log("User roles determined:", roles);
          
          if (roles.isClient) {
            console.log("User is a client, redirecting to client dashboard");
            navigate("/client/dashboard", { replace: true });
          } else if (roles.isAdmin) {
            console.log("User is an admin, redirecting to admin dashboard");
            navigate("/admin/dashboard", { replace: true });
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
      console.log("useAuthOperations - Signing out user");
      
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error("Sign out error:", error);
        throw error;
      }
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out",
      });
      
      navigate("/", { replace: true });
      
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
