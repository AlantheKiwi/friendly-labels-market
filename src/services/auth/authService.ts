
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

// IMPROVED: Use direct admin email check as the primary authorization method
export const checkUserRoles = async (userId: string): Promise<UserRoles> => {
  // First get the user to check if it's our admin
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    // Direct admin check by email - highest priority check
    if (userData?.user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      console.log("Admin email match found, granting all access");
      return { isAdmin: true, isClient: true };
    }
    
    // Special case for testing
    if (userId === "admin") {
      console.log("Admin role requested via special ID");
      return { isAdmin: true, isClient: true };
    }
    
    // For all other users, check roles normally
    return await checkRoles(userId);
  } catch (error) {
    console.error("Error in checkUserRoles:", error);
    // Fallback for authenticated users
    if (userId) {
      return { isAdmin: false, isClient: true };
    }
    return { isAdmin: false, isClient: false };
  }
};
