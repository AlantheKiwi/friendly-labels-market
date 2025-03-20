
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { checkUserRoles } from "./useRoleCheck";

export const useAuthOperations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
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
        const roles = await checkUserRoles(data.user.id);
        
        // Always redirect clients to their dashboard
        if (roles.isClient) {
          console.log("Redirecting client to dashboard");
          navigate("/client/dashboard");
        } else if (roles.isAdmin) {
          console.log("Redirecting admin to dashboard");
          navigate("/admin/dashboard");
        } else {
          console.log("No specific role, redirecting to home");
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

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Sign out failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  return { signIn, signUp, signOut };
};
