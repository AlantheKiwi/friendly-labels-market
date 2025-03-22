
import { supabase } from "@/integrations/supabase/client";
import { UserRoles } from "@/types/auth";

export const checkUserRoles = async (userId: string): Promise<UserRoles> => {
  try {
    console.log("Checking roles for user:", userId);
    
    if (!userId) {
      console.error("No user ID provided to checkUserRoles");
      return { isAdmin: false, isClient: false };
    }
    
    // Query the user_roles table directly with a short timeout
    const { data: userRoles, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .timeout(3000);
    
    if (error) {
      console.error("Error checking user roles:", error);
      return { isAdmin: false, isClient: false };
    }
    
    // Add detailed logging to see what's happening
    console.log("User roles query result:", JSON.stringify(userRoles));
    
    if (!userRoles || userRoles.length === 0) {
      console.log("No roles found for user:", userId);
      
      // Double-check with the RPC function as a fallback
      try {
        console.log("Trying fallback role check with has_role RPC");
        const { data: isClientRole } = await supabase.rpc('has_role', {
          user_id: userId,
          role: 'client'
        });
        
        const { data: isAdminRole } = await supabase.rpc('has_role', {
          user_id: userId,
          role: 'admin'
        });
        
        console.log("Fallback role check results - isClient:", isClientRole, "isAdmin:", isAdminRole);
        
        if (isClientRole || isAdminRole) {
          return { 
            isAdmin: !!isAdminRole, 
            isClient: !!isClientRole 
          };
        }
      } catch (rpcError) {
        console.error("Fallback role check failed:", rpcError);
      }
      
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

// Helper function to assign client role if missing
export const ensureClientRole = async (userId: string): Promise<boolean> => {
  try {
    console.log("Ensuring client role for user:", userId);
    
    // First check if the role already exists
    const { data: hasRole } = await supabase.rpc('has_role', {
      user_id: userId,
      role: 'client'
    });
    
    if (hasRole) {
      console.log("User already has client role");
      return true;
    }
    
    // If not, assign the role
    console.log("Assigning missing client role");
    const { error } = await supabase.rpc('assign_client_role', {
      user_id: userId
    });
    
    if (error) {
      console.error("Failed to assign client role:", error);
      return false;
    }
    
    console.log("Successfully assigned client role");
    return true;
  } catch (error) {
    console.error("Error in ensureClientRole:", error);
    return false;
  }
};
