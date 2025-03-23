
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_ADMIN_PASSWORD, ADMIN_EMAIL } from "../../constants";
import { signUp } from "../../authService";

// Direct password update attempt for development environments
export const attemptDirectPasswordUpdate = async (userId: string) => {
  try {
    console.log("Attempting direct password update for user:", userId);
    
    // Try to update the user directly (requires admin key in production)
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      userId, 
      { password: DEFAULT_ADMIN_PASSWORD }
    );
    
    if (!updateError) {
      console.log("Admin password directly reset to default (DEV MODE)");
      return { 
        success: true, 
        message: "Admin password has been reset to default" 
      };
    }
    
    console.log("Direct password update failed:", updateError);
    return { success: false };
  } catch (error) {
    console.error("Error in direct password update:", error);
    return { success: false };
  }
};

// Attempt to recreate the admin user (dev mode only)
export const attemptUserRecreation = async () => {
  try {
    console.log("Attempting to recreate admin user");
    
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
          success: true,
          message: "Admin account recreated with default password" 
        };
      } else {
        console.error("Failed to recreate admin account:", signUpError);
      }
    }
    
    return { success: false };
  } catch (error) {
    console.error("Error in user recreation:", error);
    return { success: false };
  }
};
