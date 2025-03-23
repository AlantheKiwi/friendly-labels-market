
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
    
    // If user already exists, try to update password directly
    if (signUpError && signUpError.message.includes("already registered")) {
      console.log("Admin exists, attempting direct password reset");
      
      // For development environments where email reset doesn't work well
      // We'll use an admin API endpoint to directly reset the password
      // This is simulated - in production you'd call a secure edge function
      
      try {
        // DEV MODE ONLY: Try to sign in as admin with ANY password to get the user ID
        // This is just to find the admin user, not for actual authentication
        const { error: authError, data: authData } = await supabase.auth.signInWithPassword({
          email: ADMIN_EMAIL,
          password: "wrongpassword-just-to-get-user" // This will fail but might help get user ID
        });
        
        // Now use admin API to update user (requires admin key in production)
        // In development, this might work depending on Supabase configuration
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          authData?.user?.id || "405ed3d7-8ff0-4ec6-a432-2167eb07be2c", // Default admin ID or found ID
          { password: DEFAULT_ADMIN_PASSWORD }
        );
        
        if (!updateError) {
          console.log("Admin password directly reset to default (DEV MODE)");
          return { 
            data: { message: "Admin password has been reset to default" }, 
            error: null 
          };
        } else {
          console.log("Direct password reset failed:", updateError);
          
          // Fallback to email reset
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
              error: { message: "Failed to reset password. In development, you may need to recreate the admin account." } 
            };
          }
          
          console.log("Password reset email sent as fallback");
          return { 
            data: { message: "Password reset email sent. Check your email or console logs." }, 
            error: null 
          };
        }
      } catch (directResetError: any) {
        console.error("Error in direct password reset:", directResetError);
        
        // Fallback to a development-friendly message
        return { 
          data: { message: "For development: Use DEFAULT_ADMIN_PASSWORD directly or recreate the database." }, 
          error: null 
        };
      }
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
    // For development environments, provide a direct reset option
    // This would typically call a secure edge function in production
    
    // For dev mode, we'll try to recreate the admin user if possible
    const { data: userData, error: userError } = await supabase.auth.admin.deleteUser(
      "405ed3d7-8ff0-4ec6-a432-2167eb07be2c" // Default admin ID 
    );
    
    if (!userError) {
      console.log("Existing admin user deleted for recreation");
      
      // Wait a moment for deletion to process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new admin user with default password
      const { data: signUpData, error: signUpError } = await signUp(
        ADMIN_EMAIL,
        DEFAULT_ADMIN_PASSWORD,
        {
          full_name: "Administrator",
          is_admin: true
        }
      );
      
      if (!signUpError) {
        console.log("Admin account recreated with default password");
        return { 
          data: { message: "Admin account recreated with default password" }, 
          error: null 
        };
      } else {
        console.error("Failed to recreate admin account:", signUpError);
      }
    }
    
    // Fallback to email method if direct approach fails
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
      data: { message: "Development mode: Please check console logs for password reset instructions." }, 
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
