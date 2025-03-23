
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD } from "@/services/auth/constants";

/**
 * Creates the admin user if it doesn't already exist
 * @returns Promise resolving to success status and message
 */
export const createAdminIfNotExists = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // Check if admin already exists
    const { data, error: searchError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 100
    });
    
    if (searchError) {
      console.error("Error searching for admin user:", searchError);
      return { 
        success: false, 
        message: "Failed to check if admin exists: " + searchError.message 
      };
    }
    
    // Check if admin email exists in the returned users
    // Use explicit type checking and optional chaining for safety
    const adminExists = data?.users?.some(
      user => {
        if (user && typeof user === 'object' && user.email) {
          return user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
        }
        return false;
      }
    );
    
    if (adminExists) {
      return { 
        success: true, 
        message: "Admin user already exists" 
      };
    }
    
    // Admin doesn't exist, create it
    const { error: createError } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: DEFAULT_ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: {
        is_admin: true
      }
    });
    
    if (createError) {
      console.error("Error creating admin user:", createError);
      return { 
        success: false, 
        message: "Failed to create admin user: " + createError.message 
      };
    }
    
    return { 
      success: true, 
      message: "Admin user created successfully" 
    };
  } catch (error) {
    console.error("Error in createAdminIfNotExists:", error);
    return { 
      success: false, 
      message: "An unexpected error occurred: " + (error instanceof Error ? error.message : String(error))
    };
  }
};
