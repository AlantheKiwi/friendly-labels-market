
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD } from "./constants";
import { checkPasswordDebugInfo } from "@/utils/passwordDebugUtils";

interface AdminOperationResult {
  success: boolean;
  message: string;
}

// Create admin if it doesn't exist
export const createAdminIfNotExists = async (): Promise<AdminOperationResult> => {
  try {
    console.log("Checking if admin exists...");
    
    // First check if admin already exists
    const { data: existingUsers, error: checkError } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin');
      
    if (checkError) {
      console.error("Error checking existing admin:", checkError);
      return { 
        success: false, 
        message: `Error checking if admin exists: ${checkError.message}` 
      };
    }
    
    if (existingUsers && existingUsers.length > 0) {
      console.log("Admin user already exists");
      return { 
        success: true, 
        message: "Admin user already exists" 
      };
    }
    
    console.log("No admin found, creating admin user with email:", ADMIN_EMAIL);
    
    // Check password for any issues
    const passwordInfo = checkPasswordDebugInfo(DEFAULT_ADMIN_PASSWORD);
    console.log("Password debug info:", passwordInfo);
    
    // Create the admin user
    const { data, error } = await supabase.auth.signUp({
      email: ADMIN_EMAIL,
      password: DEFAULT_ADMIN_PASSWORD,
      options: {
        data: {
          is_admin: true,
        }
      }
    });
    
    if (error) {
      console.error("Error creating admin user:", error);
      return { 
        success: false, 
        message: `Failed to create admin: ${error.message}` 
      };
    }
    
    if (!data.user) {
      return { 
        success: false, 
        message: "Admin creation failed - no user returned" 
      };
    }
    
    console.log("Admin user created successfully, adding admin role");
    
    // Add admin role
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: data.user.id,
        role: 'admin'
      });
      
    if (roleError) {
      console.error("Error adding admin role:", roleError);
      return { 
        success: false, 
        message: `Admin created but failed to add role: ${roleError.message}` 
      };
    }
    
    return { 
      success: true, 
      message: `Admin user created successfully with email: ${ADMIN_EMAIL}` 
    };
  } catch (error) {
    console.error("Error in createAdminIfNotExists:", error);
    return { 
      success: false, 
      message: `Unexpected error: ${error?.message || String(error)}` 
    };
  }
};

// Force reset admin password
export const forceResetAdminPassword = async (): Promise<AdminOperationResult> => {
  try {
    console.log("Attempting to reset admin password...");
    
    // Check if admin user exists by email using getUser method
    const { data: authUser, error: userCheckError } = await supabase.auth.getUser();
    
    if (userCheckError) {
      console.error("Error checking user:", userCheckError);
      return {
        success: false,
        message: `Failed to check current user: ${userCheckError.message}`
      };
    }
    
    // First check if current user is admin
    const isCurrentUserAdmin = authUser?.user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    
    if (!isCurrentUserAdmin) {
      // Try to create admin if it doesn't exist
      const createResult = await createAdminIfNotExists();
      if (!createResult.success) {
        return createResult;
      }
    }
    
    // Reset password with auth API
    const { error } = await supabase.auth.resetPasswordForEmail(
      ADMIN_EMAIL,
      {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      }
    );
    
    if (error) {
      console.error("Error resetting admin password:", error);
      return { 
        success: false, 
        message: `Failed to reset admin password: ${error.message}` 
      };
    }
    
    return { 
      success: true, 
      message: `Password reset email sent to ${ADMIN_EMAIL}` 
    };
  } catch (error) {
    console.error("Error in resetAdminPassword:", error);
    return { 
      success: false, 
      message: `Unexpected error: ${error?.message || String(error)}` 
    };
  }
};

// Direct admin setup - updated to ensure it works on existing accounts
export const ensureAdminCanLogin = async (): Promise<AdminOperationResult> => {
  try {
    console.log("Ensuring admin can login with default credentials...");
    
    // Try signing in with default credentials first
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: DEFAULT_ADMIN_PASSWORD
    });
    
    // If we can sign in, admin exists with default password
    if (!signInError && signInData?.user) {
      console.log("Admin login successful with default credentials");
      
      // Check for admin role
      const { data: roleData, error: roleCheckError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', signInData.user.id)
        .eq('role', 'admin');
        
      if (roleCheckError) {
        console.error("Error checking admin role:", roleCheckError);
      }
      
      // If role not found, add it
      if (!roleData || roleData.length === 0) {
        console.log("Admin user exists but role is missing, adding role");
        
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({
            user_id: signInData.user.id,
            role: 'admin'
          });
          
        if (insertError) {
          console.error("Error adding admin role:", insertError);
          return {
            success: true,
            message: "Admin login works but role assignment failed. You may have limited access."
          };
        }
      }
      
      return {
        success: true,
        message: "Admin account exists and is configured correctly with default password"
      };
    }
    
    // If sign-in failed with "Invalid login credentials", try to update the password
    if (signInError) {
      console.log("Admin login failed:", signInError.message);
      
      // Look up user by email - we need to use a different approach here
      // First let's check if we can find the admin user by getting all users in user_roles
      const { data: adminRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');
      
      if (rolesError) {
        console.error("Error looking up admin roles:", rolesError);
        // Fall back to creating a new admin
        return await createAdminIfNotExists();
      }
      
      if (adminRoles && adminRoles.length > 0) {
        console.log("Found admin role, attempting to update password");
        
        // User exists but password doesn't match - try to update it
        const { error: updateError } = await supabase.auth.updateUser({
          password: DEFAULT_ADMIN_PASSWORD
        });
        
        if (updateError) {
          console.error("Error updating admin password:", updateError);
          return {
            success: false,
            message: `Admin account exists but password reset failed: ${updateError.message}`
          };
        }
        
        return {
          success: true,
          message: "Admin password has been reset to the default password"
        };
      } else {
        // Admin not found, create new one
        console.log("Admin user not found, creating new admin");
        return await createAdminIfNotExists();
      }
    }
    
    // If we got here, something unexpected happened
    return {
      success: false,
      message: "Could not verify admin account status"
    };
  } catch (error) {
    console.error("Error in ensureAdminCanLogin:", error);
    return { 
      success: false, 
      message: `Unexpected error: ${error?.message || String(error)}` 
    };
  }
};
