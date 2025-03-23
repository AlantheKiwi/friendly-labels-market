
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD } from "@/services/auth/constants";

/**
 * Resets the admin password to the default password
 * @returns Promise resolving to success status and message
 */
export const resetAdminPassword = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(ADMIN_EMAIL);
    
    if (error) {
      console.error("Error resetting admin password:", error);
      return { 
        success: false, 
        message: "Failed to send password reset email: " + error.message 
      };
    }
    
    return { 
      success: true, 
      message: "Password reset email sent to admin" 
    };
  } catch (error) {
    console.error("Error in resetAdminPassword:", error);
    return { 
      success: false, 
      message: "An unexpected error occurred: " + (error instanceof Error ? error.message : String(error))
    };
  }
};

/**
 * Force resets the admin password to the default password without email verification
 * Note: Requires admin privileges
 * @returns Promise resolving to success status and message
 */
export const forceResetAdminPassword = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // Get the admin user ID
    const { data, error: userError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 100
    });
    
    if (userError || !data) {
      console.error("Error finding admin user:", userError);
      return { 
        success: false, 
        message: "Failed to find admin user" 
      };
    }
    
    // Find the admin user by email with proper type checking
    const adminUser = data.users?.find(user => {
      if (user && typeof user === 'object' && user.email) {
        return user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
      }
      return false;
    });
    
    if (!adminUser) {
      return {
        success: false,
        message: "Admin user not found"
      };
    }
    
    const adminId = adminUser.id;
    
    // Update the password
    const { error } = await supabase.auth.admin.updateUserById(
      adminId,
      { password: DEFAULT_ADMIN_PASSWORD }
    );
    
    if (error) {
      console.error("Error updating admin password:", error);
      return { 
        success: false, 
        message: "Failed to update admin password: " + error.message 
      };
    }
    
    return { 
      success: true, 
      message: "Admin password reset successfully to default" 
    };
  } catch (error) {
    console.error("Error in forceResetAdminPassword:", error);
    return { 
      success: false, 
      message: "An unexpected error occurred: " + (error instanceof Error ? error.message : String(error))
    };
  }
};
