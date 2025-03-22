
import React, { createContext, useContext, useCallback } from "react";
import { AuthContextType } from "./authTypes";
import { useAuthState } from "./useAuthState";
import { useAuthListeners } from "./useAuthListeners";
import { useAuthService } from "@/hooks/useAuthService";
import { useAuthOperations } from "@/hooks/useAuthOperations";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get auth state management
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

  // Get auth operations
  const { signIn, signUp, signOut: authSignOut } = useAuthOperations();

  // Setup auth listeners
  useAuthListeners({
    setSession,
    setUser,
    setIsAdmin: (value) => {},  // Handled by checkRolesWithTimeout
    setIsClient: (value) => {}, // Handled by checkRolesWithTimeout
    setIsLoading,
    checkRolesWithTimeout
  });

  // Function to manually refresh roles
  const refreshRoles = useCallback(async () => {
    if (user?.id) {
      console.log("Manual role refresh triggered for user:", user.id);
      setIsLoading(true);
      return checkRolesWithTimeout(user.id);
    }
    return { isAdmin: false, isClient: false };
  }, [user, checkRolesWithTimeout, setIsLoading]);

  // Wrap the authSignOut function provided by useAuthOperations
  const signOut = async (): Promise<void> => {
    try {
      console.log("AuthContext - Starting signOut process");
      
      // Clear state before calling authSignOut
      setSession(null);
      setUser(null);
      
      // Force a full signout that will redirect to home page
      await authSignOut();
      
      // Force reload the page to ensure clean state
      window.location.href = "/";
      
      console.log("AuthContext - signOut complete, state cleared");
      return Promise.resolve();
    } catch (error) {
      console.error("Error in signOut:", error);
      throw error;
    }
  };

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

  console.log("AuthContext current state:", { 
    hasUser: !!user, 
    userId: user?.id,
    isAdmin, 
    isClient, 
    isLoading,
    lastRoleCheck: new Date(lastRoleCheck).toISOString()
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
