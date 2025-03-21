
import { supabase } from "@/integrations/supabase/client";
import { UserRoles } from "@/types/auth";

export const checkUserRoles = async (userId: string): Promise<UserRoles> => {
  try {
    console.log("Checking roles for user:", userId);
    
    // Query all roles for this user at once to reduce database calls
    // Fix the ambiguous column issue by specifying the table name
    const { data: userRoles, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_roles.user_id", userId);
    
    if (error) {
      console.error("Error checking user roles:", error);
      return { isAdmin: false, isClient: false };
    }
    
    // Check if the user has admin or client roles
    const isAdmin = userRoles?.some(role => role.role === 'admin') || false;
    const isClient = userRoles?.some(role => role.role === 'client') || false;
    
    const roles = { isAdmin, isClient };
    
    console.log("User roles:", roles);
    return roles;
  } catch (error) {
    console.error("Error checking roles:", error);
    return {
      isAdmin: false,
      isClient: false
    };
  }
};
