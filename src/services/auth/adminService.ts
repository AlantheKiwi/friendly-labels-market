
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_ADMIN_PASSWORD, ADMIN_EMAIL } from "./constants";
import { signInWithPassword, signUp } from "./authService";

// Completely rewritten admin creation function with simplified logic and debugging
export const createAdminIfNotExists = async () => {
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

// New function to reset admin password
export const resetAdminPassword = async () => {
  console.log("Attempting to reset admin password to default");
  
  try {
    // First, verify user exists by trying to find the admin user
    console.log("Checking if admin exists:", ADMIN_EMAIL);
    
    // Call the server to reset the admin password (this would be a custom function in Supabase)
    // For now, we'll simulate this by signing up with the same email which will error if it exists
    const { data: signUpData, error: signUpError } = await signUp(
      ADMIN_EMAIL,
      DEFAULT_ADMIN_PASSWORD,
      {
        full_name: "Administrator",
        is_admin: true
      }
    );
    
    // If user already exists, try to update password via Supabase's password reset
    if (signUpError && signUpError.message.includes("already registered")) {
      console.log("Admin exists, sending password reset email");
      
      // For direct password reset (not email-based), we would need a Supabase function
      // As a workaround, we can use the password reset email flow
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        ADMIN_EMAIL,
        {
          redirectTo: `${window.location.origin}/admin/reset-password`,
        }
      );
      
      if (resetError) {
        console.log("Password reset email failed:", resetError.message);
        return { 
          data: null, 
          error: { message: "Failed to send password reset email: " + resetError.message } 
        };
      }
      
      console.log("Password reset email sent successfully");
      return { 
        data: { message: "Password reset email sent. Please check your email." }, 
        error: null 
      };
    }
    
    if (signUpError) {
      console.log("Error checking admin account:", signUpError.message);
      return { 
        data: null, 
        error: { message: "Error checking admin account: " + signUpError.message } 
      };
    }
    
    // If we got here, admin account was just created
    console.log("Admin account created with default password");
    return { 
      data: { message: "Admin account created with default password" }, 
      error: null 
    };
  } catch (error: any) {
    console.error("Unexpected error during admin password reset:", error);
    return { 
      data: null, 
      error: { message: "An unexpected error occurred during admin password reset" } 
    };
  }
};
