
import { supabase } from "@/integrations/supabase/client";
import { UserRoles } from "@/types/auth";

export const checkUserRoles = async (userId: string): Promise<UserRoles> => {
  try {
    console.log("Checking roles for user:", userId);
    
    if (!userId) {
      console.error("No user ID provided to checkUserRoles");
      return { isAdmin: false, isClient: false };
    }
    
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
      
      // Attempt to assign client role immediately
      console.log("User has no roles, attempting to assign client role");
      const assigned = await ensureClientRole(userId);
      
      if (assigned) {
        console.log("Successfully assigned client role, returning updated roles");
        return { isAdmin: false, isClient: true };
      }
      
      // If role assignment failed, try the fallback role check
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
    const { data: existingRoles, error: checkError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "client");
      
    if (checkError) {
      console.error("Error checking existing client role:", checkError);
      return false;
    }
    
    if (existingRoles && existingRoles.length > 0) {
      console.log("User already has client role");
      return true;
    }
    
    // If role doesn't exist, try to insert it directly
    console.log("Assigning missing client role via direct insert");
    const { error: insertError } = await supabase
      .from("user_roles")
      .insert({ user_id: userId, role: "client" });
      
    if (insertError) {
      console.error("Direct insert failed, trying RPC function:", insertError);
      
      // If direct insert fails, try the RPC function as fallback
      const { error: rpcError } = await supabase.rpc('assign_client_role', {
        user_id: userId
      });
      
      if (rpcError) {
        console.error("Failed to assign client role via RPC:", rpcError);
        return false;
      }
    }
    
    console.log("Successfully assigned client role");
    return true;
  } catch (error) {
    console.error("Error in ensureClientRole:", error);
    return false;
  }
};
