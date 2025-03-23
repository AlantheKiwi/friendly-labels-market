
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_ADMIN_PASSWORD, ADMIN_EMAIL } from "../constants";
import { signInWithPassword, signUp } from "../authService";

// Enhanced reset admin password function with better debugging
export const resetAdminPassword = async () => {
  console.log("Attempting to reset admin password to default");
  
  try {
    // First, verify user exists by trying to find the admin user
    console.log("Checking if admin exists:", ADMIN_EMAIL);
    
    // Try to look up if the user exists first - we can't directly query by email
    // Instead, we'll try to sign in with the default credentials to see if the account exists
    const { data: signInData, error: signInError } = await signInWithPassword(
      ADMIN_EMAIL,
      DEFAULT_ADMIN_PASSWORD
    );
    
    let adminFound = !!signInData?.user;
    
    if (signInError && !signInError.message.includes("Invalid login credentials")) {
      // An error other than invalid credentials indicates some other issue
      console.log("Error checking admin account:", signInError);
      return { 
        data: null, 
        error: { message: "Error checking admin account: " + signInError.message } 
      };
    }
    
    if (adminFound) {
      console.log("Admin exists and default password is valid");
      return { 
        data: { message: "Admin account exists and default password is valid" }, 
        error: null 
      };
    }
      
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

// Function to force reset admin password through direct access
export const forceResetAdminPassword = async () => {
  console.log("Attempting to force reset admin password");
  
  try {
    // In a real implementation, this would call a secure edge function
    // For now, we'll use the password reset email flow as a fallback
    const { error } = await supabase.auth.resetPasswordForEmail(
      ADMIN_EMAIL,
      {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      }
    );
    
    if (error) {
      console.error("Force password reset failed:", error);
      return { 
        data: null, 
        error: { message: "Password reset failed: " + error.message } 
      };
    }
    
    return { 
      data: { message: "Password reset email sent. Please check your email." }, 
      error: null 
    };
  } catch (error: any) {
    console.error("Unexpected error during force password reset:", error);
    return { 
      data: null, 
      error: { message: "An unexpected error occurred" } 
    };
  }
};
