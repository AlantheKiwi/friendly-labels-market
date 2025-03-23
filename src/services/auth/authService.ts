
import { supabase } from "@/integrations/supabase/client";
import { UserRoles } from "@/types/auth";
import { DEFAULT_ADMIN_PASSWORD, ADMIN_EMAIL } from "./constants";
import { checkUserRoles as checkRoles } from "@/hooks/useRoleCheck";

// Core authentication methods
export const signInWithPassword = async (email: string, password: string) => {
  console.log("Attempting to sign in with email:", email);
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signUp = async (email: string, password: string, userData: any) => {
  console.log("Attempting to sign up with email:", email);
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });
};

export const signOut = async () => {
  console.log("Signing out user");
  return await supabase.auth.signOut({ 
    scope: 'global' 
  });
};

export const getUser = async () => {
  return await supabase.auth.getUser();
};

export const getSession = async () => {
  return await supabase.auth.getSession();
};

// Reusing the checkUserRoles function but exposing it through our service
export const checkUserRoles = async (userId: string): Promise<UserRoles> => {
  // First get the user to check if it's our admin
  const { data: userData } = await supabase.auth.getUser();
  
  if (userData?.user?.email?.toLowerCase() === ADMIN_EMAIL) {
    // For our specific admin, we automatically assign admin role
    return { isAdmin: true, isClient: true };
  }
  
  // For all other users, check roles normally
  return await checkRoles(userId);
};
