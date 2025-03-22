
import React, { createContext, useContext } from "react";
import { AuthContextType } from "./authTypes";

// Create a mock AuthContext with minimal implementation
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a simplified AuthProvider that doesn't actually implement authentication
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Provide a minimal implementation that satisfies the AuthContextType
  const value: AuthContextType = {
    session: null,
    user: null,
    isAdmin: false,
    isClient: false,
    isLoading: false,
    signIn: async () => {},
    signUp: async () => {},
    signOut: async () => Promise.resolve(),
    refreshRoles: async () => ({ isAdmin: false, isClient: false }),
    lastRoleCheck: 0
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
