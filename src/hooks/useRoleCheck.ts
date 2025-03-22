
import { supabase } from "@/integrations/supabase/client";
import { UserRoles } from "@/types/auth";

export const checkUserRoles = async (userId: string): Promise<UserRoles> => {
  try {
    console.log("Checking roles for user:", userId);
    
    if (!userId) {
      console.error("No user ID provided to checkUserRoles");
      return { isAdmin: false, isClient: false };
    }
    
    // First, attempt to assign client role automatically for all authenticated users
    // This ensures every authenticated user has at least client role
    await ensureClientRole(userId);
    
    // Query the user_roles table directly
    const { data: userRoles, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    
    if (error) {
      console.error("Error checking user roles:", error);
      
      // Retry with a slight delay (network issues sometimes cause first attempt to fail)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { data: retryUserRoles, error: retryError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);
        
      if (retryError) {
        console.error("Error checking user roles (retry):", retryError);
        // If there's still an error, try one more time to assign the client role
        await ensureClientRole(userId);
        return { isAdmin: false, isClient: true }; // Default to client access for auth users
      }
      
      if (retryUserRoles && retryUserRoles.length > 0) {
        const isAdmin = retryUserRoles.some(role => role.role === 'admin') || false;
        const isClient = isAdmin || retryUserRoles.some(role => role.role === 'client') || false;
        return { isAdmin, isClient };
      }
    }
    
    if (!userRoles || userRoles.length === 0) {
      console.log("No roles found for user:", userId);
      
      // One more attempt to assign client role
      await ensureClientRole(userId);
      
      // As a final check, verify if the role was assigned
      const { data: verifyRoles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);
        
      if (verifyRoles && verifyRoles.length > 0) {
        const isAdmin = verifyRoles.some(role => role.role === 'admin') || false;
        const isClient = isAdmin || verifyRoles.some(role => role.role === 'client') || false;
        return { isAdmin, isClient };
      }
      
      // Default to client access as a fallback for authenticated users
      return { isAdmin: false, isClient: true };
    }
    
    // Check if the user has admin or client roles
    const isAdmin = userRoles.some(role => role.role === 'admin') || false;
    
    // Important: If user is admin, also set isClient to true
    const isClient = isAdmin || userRoles.some(role => role.role === 'client') || false;
    
    const roles = { isAdmin, isClient };
    console.log("Final role determination:", roles);
    
    return roles;
  } catch (error) {
    console.error("Error checking roles:", error);
    // Default to giving client access as a fallback for authenticated users
    return {
      isAdmin: false,
      isClient: true
    };
  }
};

// Helper function to assign client role if missing - strengthened implementation
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
    }
    
    if (existingRoles && existingRoles.length > 0) {
      console.log("User already has client role");
      return true;
    }
    
    // Try multiple approaches to assign the role
    
    // 1. Try direct insert first (most reliable)
    console.log("Assigning client role via direct insert");
    const { error: insertError } = await supabase
      .from("user_roles")
      .insert({ user_id: userId, role: "client" });
      
    if (!insertError) {
      console.log("Successfully assigned client role via direct insert");
      return true;
    }
    
    console.error("Direct insert failed:", insertError);
    
    // 2. Try RPC function as fallback
    console.log("Assigning client role via RPC");
    const { error: rpcError } = await supabase.rpc('assign_client_role', {
      user_id: userId
    });
    
    if (!rpcError) {
      console.log("Successfully assigned client role via RPC");
      return true;
    }
    
    console.error("RPC failed:", rpcError);
    
    // 3. Final verification check
    const { data: verifyRoles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "client");
      
    if (verifyRoles && verifyRoles.length > 0) {
      console.log("Verification confirms client role exists");
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error in ensureClientRole:", error);
    return false;
  }
};
