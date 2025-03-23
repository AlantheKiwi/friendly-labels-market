
import { supabase } from "@/integrations/supabase/client";
import { checkUserRoles as checkRoles } from "./useRoleCheck";
import { UserRoles } from "@/types/auth";

// This service handles pure authentication operations without UI dependencies
export const useAuthService = () => {
  const signInWithPassword = async (email: string, password: string) => {
    console.log("Attempting to sign in with email:", email);
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email: string, password: string, userData: any) => {
    console.log("Attempting to sign up with email:", email);
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
  };

  const signOut = async () => {
    console.log("Signing out user");
    return await supabase.auth.signOut({ 
      scope: 'global' 
    });
  };

  const getUser = async () => {
    return await supabase.auth.getUser();
  };

  const getSession = async () => {
    return await supabase.auth.getSession();
  };

  // Special function to create admin user if it doesn't exist
  const createAdminIfNotExists = async (email: string, password: string) => {
    console.log("Checking if admin account exists for:", email);
    
    // First check if the user exists by trying to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({ 
      email, 
      password: "wrong-password-to-check-existence" 
    });
    
    // If error is not "Invalid login credentials", the user might exist but password is wrong
    // If error is "Invalid login credentials", we'll create the user
    if (signInError) {
      console.log("Sign in check error:", signInError.message);
      
      if (signInError.message.includes("Invalid login credentials")) {
        console.log("Admin user does not exist, creating account for:", email);
        
        // Create admin user
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: "Administrator",
              is_admin: true
            }
          }
        });
        
        if (signUpError) {
          console.error("Error creating admin user:", signUpError.message);
          return { data: null, error: signUpError };
        }
        
        console.log("Admin user created successfully");
        return { data, error: null };
      }
      
      return { data: null, error: signInError };
    }
    
    console.log("Admin user already exists");
    return { data: null, error: null };
  };

  // Reusing the checkUserRoles function but exposing it through our service
  // Also adding special handling for admin email
  const checkUserRoles = async (userId: string): Promise<UserRoles> => {
    // First get the user to check if it's our admin
    const { data: userData } = await supabase.auth.getUser();
    
    if (userData?.user?.email?.toLowerCase() === "alan@insight-ai-systems.com") {
      // For our specific admin, we automatically assign admin role
      return { isAdmin: true, isClient: true };
    }
    
    // For all other users, check roles normally
    return await checkRoles(userId);
  };

  return {
    signInWithPassword,
    signUp,
    signOut,
    getUser,
    getSession,
    checkUserRoles,
    createAdminIfNotExists
  };
};
