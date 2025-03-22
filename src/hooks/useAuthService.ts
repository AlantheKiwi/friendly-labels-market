
import { supabase } from "@/integrations/supabase/client";
import { checkUserRoles as checkRoles } from "./useRoleCheck";
import { UserRoles } from "@/types/auth";

// This service handles pure authentication operations without UI dependencies
export const useAuthService = () => {
  const signInWithPassword = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email: string, password: string, userData: any) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
  };

  const signOut = async () => {
    return await supabase.auth.signOut({ 
      scope: 'global' 
    });
  };

  const getUser = async () => {
    return await supabase.auth.getUser();
  };

  const getSession = async () => {
    return await supabase.auth.getSession();
  };

  // Reusing the checkUserRoles function but exposing it through our service
  const checkUserRoles = async (userId: string): Promise<UserRoles> => {
    return await checkRoles(userId);
  };

  return {
    signInWithPassword,
    signUp,
    signOut,
    getUser,
    getSession,
    checkUserRoles
  };
};
