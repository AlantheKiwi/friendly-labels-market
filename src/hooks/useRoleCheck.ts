
import { supabase } from "@/integrations/supabase/client";
import { UserRoles } from "@/types/auth";

export const checkUserRoles = async (userId: string): Promise<UserRoles> => {
  try {
    console.log("Checking roles for user:", userId);
    
    const { data: adminRole, error: adminError } = await supabase.rpc('has_role', {
      user_id: userId,
      role: 'admin'
    });
    
    if (adminError) {
      console.error("Error checking admin role:", adminError);
    }
    
    const { data: clientRole, error: clientError } = await supabase.rpc('has_role', {
      user_id: userId,
      role: 'client'
    });
    
    if (clientError) {
      console.error("Error checking client role:", clientError);
    }
    
    const roles = {
      isAdmin: !!adminRole,
      isClient: !!clientRole
    };
    
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
