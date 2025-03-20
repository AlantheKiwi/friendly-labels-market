
import { supabase } from "@/integrations/supabase/client";

export const checkUserRoles = async (userId: string) => {
  try {
    const { data: adminRole } = await supabase.rpc('has_role', {
      user_id: userId,
      role: 'admin'
    });
    
    const { data: clientRole } = await supabase.rpc('has_role', {
      user_id: userId,
      role: 'client'
    });
    
    return {
      isAdmin: !!adminRole,
      isClient: !!clientRole
    };
  } catch (error) {
    console.error("Error checking roles:", error);
    return {
      isAdmin: false,
      isClient: false
    };
  }
};
