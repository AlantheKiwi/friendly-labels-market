
import { supabase } from "@/integrations/supabase/client";
import { UserRoles } from "@/types/auth";

export const checkUserRoles = async (userId: string): Promise<UserRoles> => {
  try {
    console.log("Checking roles for user:", userId);
    
    // Query the user_roles table directly
    const { data: userRoles, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    
    if (error) {
      console.error("Error checking user roles:", error);
      return { isAdmin: false, isClient: false };
    }
    
    // Add detailed logging to see what's happening
    console.log("User roles query result:", JSON.stringify(userRoles));
    
    if (!userRoles || userRoles.length === 0) {
      console.log("No roles found for user:", userId);
      return { isAdmin: false, isClient: false };
    }
    
    // Check if the user has admin or client roles
    const isAdmin = userRoles.some(role => role.role === 'admin') || false;
    const isClient = userRoles.some(role => role.role === 'client') || false;
    
    const roles = { isAdmin, isClient };
    
    console.log("Final role determination:", roles);
    return roles;
  } catch (error) {
    console.error("Error checking roles:", error);
    return {
      isAdmin: false,
      isClient: false
    };
  }
};
