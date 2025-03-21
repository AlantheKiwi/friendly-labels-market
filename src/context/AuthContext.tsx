
import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthContextType } from "@/types/auth";
import { checkUserRoles } from "@/hooks/useRoleCheck";
import { useAuthOperations } from "@/hooks/useAuthOperations";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);
  const { signIn, signUp, signOut: authSignOut } = useAuthOperations();

  // Wrapper for signOut to ensure state is cleared properly
  const signOut = async (): Promise<void> => {
    try {
      console.log("AuthContext - Starting signOut process");
      
      // Clear state before calling authSignOut
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      setIsClient(false);
      
      await authSignOut();
      
      console.log("AuthContext - signOut complete, state cleared");
      return Promise.resolve();
    } catch (error) {
      console.error("Error in signOut:", error);
      throw error;
    }
  };

  useEffect(() => {
    console.log("Setting up auth listener");
    
    // Set up auth state listener first
    const { data } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        
        if (event === 'SIGNED_OUT') {
          console.log("SIGNED_OUT event received, clearing state");
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setIsClient(false);
          
          // Navigate to home page on sign out
          navigate("/", { replace: true });
        } else if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          if (currentSession.user) {
            try {
              const roles = await checkUserRoles(currentSession.user.id);
              console.log("User roles after auth state change:", roles);
              setIsAdmin(roles.isAdmin);
              setIsClient(roles.isClient);
              
              // Redirect if on login or register page
              const currentPath = window.location.pathname;
              if (currentPath === "/auth/login" || currentPath === "/auth/register" || currentPath === "/") {
                if (roles.isClient) {
                  console.log("Auth state change - redirecting client to dashboard");
                  navigate("/client/dashboard", { replace: true });
                } else if (roles.isAdmin) {
                  console.log("Auth state change - redirecting admin to dashboard");
                  navigate("/admin/dashboard", { replace: true });
                }
              }
            } catch (error) {
              console.error("Error checking roles:", error);
            }
          }
        }
        
        setIsLoading(false);
      }
    );
    
    // Store subscription reference for cleanup
    subscriptionRef.current = data.subscription;
    
    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession?.user?.id);
      
      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
        
        if (currentSession.user) {
          try {
            const roles = await checkUserRoles(currentSession.user.id);
            console.log("User roles on initial load:", roles);
            setIsAdmin(roles.isAdmin);
            setIsClient(roles.isClient);
            
            // Redirect based on roles if on homepage or auth pages
            const currentPath = window.location.pathname;
            if (currentPath === "/" || 
                currentPath === "/auth/login" || 
                currentPath === "/auth/register") {
              if (roles.isClient) {
                console.log("Initial load - redirecting client to dashboard");
                navigate("/client/dashboard", { replace: true });
              } else if (roles.isAdmin) {
                console.log("Initial load - redirecting admin to dashboard");
                navigate("/admin/dashboard", { replace: true });
              }
            }
          } catch (error) {
            console.error("Error checking roles on initial load:", error);
          }
        }
      } else {
        console.log("No session found on initial load");
      }
      
      setIsLoading(false);
    });

    // Cleanup function
    return () => {
      console.log("Cleaning up auth listener subscription");
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [navigate]);

  const value = {
    session,
    user,
    isAdmin,
    isClient,
    isLoading,
    signIn,
    signUp,
    signOut
  };

  console.log("AuthContext current state:", { 
    hasUser: !!user, 
    userId: user?.id,
    isAdmin, 
    isClient, 
    isLoading 
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
