
import { supabase } from "@/integrations/supabase/client";
import { UserRoles } from "@/types/auth";

export const checkUserRoles = async (userId: string): Promise<UserRoles> => {
  try {
    console.log("Checking roles for user:", userId);
    
    if (!userId) {
      console.error("No user ID provided to checkUserRoles");
      return { isAdmin: false, isClient: false };
    }
    
    // Query the user_roles table directly with multiple attempts
    const { data: userRoles, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    
    if (error) {
      console.error("Error checking user roles (first attempt):", error);
      
      // Retry with a slight delay (network issues sometimes cause first attempt to fail)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { data: retryUserRoles, error: retryError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);
        
      if (retryError) {
        console.error("Error checking user roles (retry):", retryError);
        return { isAdmin: false, isClient: false };
      }
      
      if (retryUserRoles && retryUserRoles.length > 0) {
        console.log("User roles retry successful:", JSON.stringify(retryUserRoles));
        
        // Check if the user has admin or client roles
        const isAdmin = retryUserRoles.some(role => role.role === 'admin') || false;
        const isClient = isAdmin || retryUserRoles.some(role => role.role === 'client') || false;
        
        return { isAdmin, isClient };
      }
    }
    
    // Add detailed logging to see what's happening
    console.log("User roles query result:", JSON.stringify(userRoles));
    
    if (!userRoles || userRoles.length === 0) {
      console.log("No roles found for user:", userId);
      
      // Immediately attempt to assign the client role
      console.log("No roles found, directly assigning client role");
      try {
        // First try with RPC function
        const { data: rpcResult, error: rpcError } = await supabase.rpc('assign_client_role', {
          user_id: userId
        });
        
        if (rpcError) {
          console.error("RPC assign_client_role failed:", rpcError);
          
          // Fallback to direct insert
          const { error: insertError } = await supabase
            .from("user_roles")
            .insert({ user_id: userId, role: "client" });
            
          if (insertError) {
            console.error("Direct insert failed:", insertError);
          } else {
            console.log("Successfully assigned client role via direct insert");
            return { isAdmin: false, isClient: true };
          }
        } else {
          console.log("Successfully assigned client role via RPC");
          return { isAdmin: false, isClient: true };
        }
      } catch (assignError) {
        console.error("Error during role assignment:", assignError);
      }
      
      // As a final check, verify if the role was assigned
      try {
        const { data: verifyRoles, error: verifyError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId);
          
        if (verifyError) {
          console.error("Error during verification check:", verifyError);
        } else if (verifyRoles && verifyRoles.length > 0) {
          console.log("Verification found roles:", JSON.stringify(verifyRoles));
          
          const isAdmin = verifyRoles.some(role => role.role === 'admin') || false;
          const isClient = isAdmin || verifyRoles.some(role => role.role === 'client') || false;
          
          return { isAdmin, isClient };
        }
      } catch (verifyError) {
        console.error("Error during role verification:", verifyError);
      }
      
      return { isAdmin: false, isClient: false };
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
    
    // Try multiple approaches to assign the role
    
    // 1. Try RPC function first
    console.log("Assigning client role via RPC");
    const { error: rpcError } = await supabase.rpc('assign_client_role', {
      user_id: userId
    });
    
    if (!rpcError) {
      console.log("Successfully assigned client role via RPC");
      return true;
    }
    
    console.error("RPC failed:", rpcError);
    
    // 2. Try direct insert as fallback
    console.log("Assigning client role via direct insert");
    const { error: insertError } = await supabase
      .from("user_roles")
      .insert({ user_id: userId, role: "client" });
      
    if (!insertError) {
      console.log("Successfully assigned client role via direct insert");
      return true;
    }
    
    console.error("Direct insert failed:", insertError);
    
    // 3. Final verification check
    const { data: verifyRoles, error: verifyError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "client");
      
    if (!verifyError && verifyRoles && verifyRoles.length > 0) {
      console.log("Verification confirms client role exists");
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error in ensureClientRole:", error);
    return false;
  }
};
