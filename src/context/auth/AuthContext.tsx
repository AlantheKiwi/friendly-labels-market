
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
    setIsLoading,
    checkRolesWithTimeout
  } = useAuthState();

  // Set up auth listeners
  useAuthListeners({
    setSession,
    setUser,
    setIsAdmin: () => {},  // We'll handle this via checkRolesWithTimeout
    setIsClient: () => {},  // We'll handle this via checkRolesWithTimeout
    setIsLoading,
    checkRolesWithTimeout
  });

  // Get auth operations
  const { signIn, signUp, signOut } = useAuthOperations();

  // Implement the refreshRoles function
  const refreshRoles = async () => {
    if (!user) return { isAdmin: false, isClient: false };
    return await checkRolesWithTimeout(user.id);
  };

  // Combine all values for the context
  const value: AuthContextType = {
    session,
    user,
    isAdmin,
    isClient,
    isLoading,
    signIn,
    signUp,
    signOut,
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
