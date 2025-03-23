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

  // Completely rewritten admin creation function with simplified logic and debugging
  const createAdminIfNotExists = async () => {
    console.log("Running simplified admin account setup");
    
    try {
      // First try to sign in with the default admin credentials
      console.log("Attempting direct sign-in with default credentials");
      console.log("Admin email:", ADMIN_EMAIL);
      console.log("Admin password length:", DEFAULT_ADMIN_PASSWORD.length);
      
      const { data: signInData, error: signInError } = await signInWithPassword(
        ADMIN_EMAIL, 
        DEFAULT_ADMIN_PASSWORD
      );
      
      // If sign-in worked, we're done!
      if (!signInError && signInData) {
        console.log("Successfully signed in with default credentials");
        return { data: signInData, error: null };
      }
      
      console.log("Default sign-in failed, checking if admin exists");
      console.log("Sign-in error details:", JSON.stringify(signInError, null, 2));
      
      // If signin failed, check if it's because the admin exists but password is wrong,
      // or if the admin doesn't exist at all
      const { data: userData, error: getUserError } = await supabase.auth.getUser();
      
      console.log("GetUser data:", userData ? "Data exists" : "No data");
      console.log("GetUser error:", getUserError ? getUserError.message : "No error");
      
      // First case - attempting to create the admin account
      console.log("Attempting to create new admin account");
      const { data: signUpData, error: signUpError } = await signUp(
        ADMIN_EMAIL,
        DEFAULT_ADMIN_PASSWORD,
        {
          full_name: "Administrator",
          is_admin: true
        }
      );
      
      if (signUpError) {
        console.log("Sign-up error:", signUpError.message);
        console.log("Full sign-up error:", JSON.stringify(signUpError, null, 2));
      }
      
      // If there was no error or the only error is that the user already exists,
      // try signing in again with the default password
      if (!signUpError || signUpError.message.includes("already registered")) {
        console.log("Admin exists or was created, trying sign in with default password");
        
        const { data: retryData, error: retryError } = await signInWithPassword(
          ADMIN_EMAIL, 
          DEFAULT_ADMIN_PASSWORD
        );
        
        if (!retryError && retryData) {
          console.log("Successfully signed in after signup attempt");
          return { data: retryData, error: null };
        }
        
        console.log("Still cannot sign in after creation attempt:", retryError);
        
        // If we still can't sign in, inform the user to use the password reset option
        return { 
          data: null, 
          error: { 
            message: "Admin account exists but password may have been changed. Try clicking 'Forgot Password' to reset it, or use the default password: " + DEFAULT_ADMIN_PASSWORD 
          } 
        };
      }
      
      // If there was some other error during signup, return it
      console.error("Error during admin creation:", signUpError);
      return { 
        data: null, 
        error: { 
          message: "Could not create admin account. Error: " + signUpError.message 
        } 
      };
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
