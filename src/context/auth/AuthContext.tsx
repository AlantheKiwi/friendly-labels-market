
import React, { createContext, useContext } from "react";
import { AuthContextType } from "./authTypes";
import { useAuthState } from "./useAuthState";
import { useAuthListeners } from "./useAuthListeners";
import { useAuthOperations } from "@/hooks/useAuthOperations";

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use our custom hooks to manage state and operations
  const {
    session,
    user,
    isAdmin,
    isClient,
    isLoading,
    lastRoleCheck,
    setSession,
    setUser,
    setIsAdmin,
    setIsClient,
    setIsLoading,
    checkRolesWithTimeout
  } = useAuthState();

  // Set up auth listeners - fixing the prop types to match what useAuthState returns
  useAuthListeners({
    setSession,
    setUser,
    setIsAdmin,
    setIsClient,
    setIsLoading,
    checkRolesWithTimeout
  });

  // Get auth operations - wrapped in useMemo to prevent unnecessary recalculations
  const authOperations = useAuthOperations();

  // Implement the refreshRoles function with direct email check fallback
  const refreshRoles = async () => {
    if (!user) return { isAdmin: false, isClient: false };
    
    // Directly check admin email as a fallback
    if (user.email?.toLowerCase() === "alan@insight-ai-systems.com") {
      setIsAdmin(true);
      setIsClient(true);
      return { isAdmin: true, isClient: true };
    }
    
    return await checkRolesWithTimeout(user.id);
  };

  // Combine all values for the context
  const value: AuthContextType = {
    session,
    user,
    isAdmin,
    isClient,
    isLoading,
    signIn: authOperations.signIn,
    signUp: authOperations.signUp,
    signOut: authOperations.signOut,
    refreshRoles,
    lastRoleCheck
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create the useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
