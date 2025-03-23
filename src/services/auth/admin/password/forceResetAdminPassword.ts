
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_EMAIL } from "../../constants";
import { attemptDirectPasswordUpdate, attemptUserRecreation } from "./devModePasswordReset";

// Function to force reset admin password through direct access
export const forceResetAdminPassword = async () => {
  console.log("Attempting to force reset admin password");
  
  try {
    // For development environments, provide a direct reset option
    
    // Try direct password update first
    const directUpdateResult = await attemptDirectPasswordUpdate("405ed3d7-8ff0-4ec6-a432-2167eb07be2c");
    
    if (directUpdateResult.success) {
      return { 
        data: { message: directUpdateResult.message }, 
        error: null 
      };
    }
    
    // Try recreation approach
    const recreationResult = await attemptUserRecreation();
    
    if (recreationResult.success) {
      return { 
        data: { message: recreationResult.message }, 
        error: null 
      };
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
