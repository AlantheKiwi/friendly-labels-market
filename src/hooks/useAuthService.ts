
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
  const createAdminIfNotExists = async (email: string, password: string) => {
    console.log("Checking if admin account exists for:", email);
    
    // For debugging, explicitly log the attempted password
    console.log("Using admin password:", password);
    
    try {
      // Force using default password for admin creation
      const adminPassword = DEFAULT_ADMIN_PASSWORD;
      console.log("Using standard admin password for setup:", adminPassword);
      
      // First try to sign in directly - if this works, the user exists with the correct password
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ 
        email, 
        password: adminPassword 
      });
      
      if (!signInError) {
        console.log("Admin sign-in successful - user exists");
        return { data: signInData, error: null };
      }
      
      console.log("Sign in failed:", signInError.message);
      
      // Let's check if the user exists by trying a password reset
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/admin/password-reset"
      });
      
      if (!resetError) {
        // User exists but password is wrong
        console.log("Admin user exists but password is incorrect");
        return { 
          data: null, 
          error: {
            message: "Admin account exists but the password may be incorrect. Try the default password: " + DEFAULT_ADMIN_PASSWORD
          } 
        };
      }
      
      // If we get here, the user likely doesn't exist, so let's create them
      console.log("Admin user does not exist, creating account for:", email);
      
      // Create admin user with default password
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password: adminPassword,
        options: {
          data: {
            full_name: "Administrator",
            is_admin: true
          }
        }
      });
      
      if (signUpError) {
        console.error("Error creating admin user:", signUpError.message);
        
        if (signUpError.message.includes("already registered")) {
          return { 
            data: null, 
            error: {
              message: "Admin account already exists but has login issues. Try the default password '" + DEFAULT_ADMIN_PASSWORD + "' or contact support."
            } 
          };
        }
        
        return { data: null, error: signUpError };
      }
      
      console.log("Admin user created successfully");
      return { data, error: null };
    } catch (error) {
      console.error("Unexpected error during admin account check:", error);
      return { 
        data: null, 
        error: { message: "An unexpected error occurred while setting up admin access" } 
      };
    }
  };

  // Reusing the checkUserRoles function but exposing it through our service
  // Also adding special handling for admin email
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
    createAdminIfNotExists
  };
};
