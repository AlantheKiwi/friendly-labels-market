
import { supabase } from "@/integrations/supabase/client";
import { checkUserRoles as checkRoles } from "./useRoleCheck";
import { UserRoles } from "@/types/auth";

// Default admin credentials - centralized for consistency
const DEFAULT_ADMIN_PASSWORD = "letmein1983!!";
const ADMIN_EMAIL = "alan@insight-ai-systems.com";

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

  // Special function to handle admin login or creation
  const createAdminIfNotExists = async () => {
    console.log("Checking if admin account exists and creating it if needed");
    
    try {
      // First check if the user exists by trying to request a password reset
      // This will succeed if the user exists, fail if not
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(ADMIN_EMAIL, {
        redirectTo: window.location.origin + "/admin/password-reset"
      });
      
      // If there's no error, the user exists
      if (!resetError) {
        console.log("Admin user exists, creating new password");
        
        // Try to sign up the user anyway, this will fail if already exists
        const { error: signUpError } = await signUp(
          ADMIN_EMAIL,
          DEFAULT_ADMIN_PASSWORD,
          {
            full_name: "Administrator",
            is_admin: true
          }
        );
        
        if (signUpError && !signUpError.message.includes("already registered")) {
          console.error("Unexpected error creating admin:", signUpError);
        } else {
          console.log("Admin signup attempted, now trying to sign in");
        }
      } else {
        console.log("Admin user does not exist, creating new user");
        
        // User does not exist, create the admin user
        const { error: createError } = await signUp(
          ADMIN_EMAIL,
          DEFAULT_ADMIN_PASSWORD,
          {
            full_name: "Administrator",
            is_admin: true
          }
        );
        
        if (createError) {
          console.error("Error creating admin user:", createError);
          return { 
            data: null, 
            error: createError 
          };
        }
        
        console.log("Admin user created successfully");
      }
      
      // Now try to sign in with the default password
      const { data, error } = await signInWithPassword(
        ADMIN_EMAIL, 
        DEFAULT_ADMIN_PASSWORD
      );
      
      if (error) {
        console.error("Error signing in admin after setup:", error);
        return { 
          data: null, 
          error: {
            message: "Admin account exists but there was a problem signing in. Try using the default password: " + DEFAULT_ADMIN_PASSWORD
          } 
        };
      }
      
      // Successfully signed in
      console.log("Admin sign-in successful");
      return { data, error: null };
    } catch (error) {
      console.error("Unexpected error during admin setup:", error);
      return { 
        data: null, 
        error: { message: "An unexpected error occurred while setting up admin access" } 
      };
    }
  };

  // Reusing the checkUserRoles function but exposing it through our service
  const checkUserRoles = async (userId: string): Promise<UserRoles> => {
    // First get the user to check if it's our admin
    const { data: userData } = await supabase.auth.getUser();
    
    if (userData?.user?.email?.toLowerCase() === ADMIN_EMAIL) {
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
    createAdminIfNotExists,
    DEFAULT_ADMIN_PASSWORD,
    ADMIN_EMAIL
  };
};
