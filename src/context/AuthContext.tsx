
import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthContextType } from "@/types/auth";
import { checkUserRoles, ensureClientRole } from "@/hooks/useRoleCheck";
import { useAuthOperations } from "@/hooks/useAuthOperations";
import { useToast } from "@/components/ui/use-toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRoleCheck, setLastRoleCheck] = useState<number>(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);
  const roleCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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

  // Helper function to check roles with improved logic
  const checkRolesWithTimeout = useCallback(async (userId: string) => {
    console.log("Starting role check with timeout for user:", userId);
    
    // Clear any existing timeout to prevent race conditions
    if (roleCheckTimeoutRef.current) {
      clearTimeout(roleCheckTimeoutRef.current);
    }
    
    // Set a timeout to ensure loading state is eventually set to false even if role check fails
    roleCheckTimeoutRef.current = setTimeout(() => {
      console.log("Role check timeout triggered - forcing loading to false");
      setIsLoading(false);
      
      // Show a toast when we hit the timeout
      toast({
        title: "Slow response",
        description: "Role check is taking longer than expected. Try refreshing.",
        variant: "destructive"
      });
    }, 5000); // 5 second timeout
    
    try {
      const roles = await checkUserRoles(userId);
      console.log("User roles determined:", roles);
      
      // If user has no roles but is authenticated, try to ensure they have client role
      if (!roles.isAdmin && !roles.isClient) {
        console.log("No roles found for authenticated user, attempting to assign client role");
        const roleAssigned = await ensureClientRole(userId);
        
        if (roleAssigned) {
          console.log("Client role assigned, rechecking roles");
          // Recheck roles after assignment
          const updatedRoles = await checkUserRoles(userId);
          setIsAdmin(updatedRoles.isAdmin);
          setIsClient(updatedRoles.isClient);
        } else {
          setIsAdmin(roles.isAdmin);
          setIsClient(roles.isClient);
        }
      } else {
        setIsAdmin(roles.isAdmin);
        setIsClient(roles.isClient);
      }
      
      // Record when we last checked roles
      setLastRoleCheck(Date.now());
      
      // Clear the timeout since we got the roles successfully
      if (roleCheckTimeoutRef.current) {
        clearTimeout(roleCheckTimeoutRef.current);
        roleCheckTimeoutRef.current = null;
      }
      
      setIsLoading(false);
      return roles;
    } catch (error) {
      console.error("Error checking roles:", error);
      setIsLoading(false);
      
      // Clear the timeout if there was an error
      if (roleCheckTimeoutRef.current) {
        clearTimeout(roleCheckTimeoutRef.current);
        roleCheckTimeoutRef.current = null;
      }
      
      return { isAdmin: false, isClient: false };
    }
  }, [toast]);

  // Function to manually refresh roles
  const refreshRoles = useCallback(async () => {
    if (user?.id) {
      console.log("Manual role refresh triggered for user:", user.id);
      setIsLoading(true);
      return checkRolesWithTimeout(user.id);
    }
    return { isAdmin: false, isClient: false };
  }, [user, checkRolesWithTimeout]);

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
          setIsLoading(false);
          
          // Force reload on sign out to ensure clean state
          if (window.location.pathname !== "/") {
            navigate("/", { replace: true });
          }
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log(`${event} event received, updating session`);
          
          if (currentSession) {
            setSession(currentSession);
            setUser(currentSession.user);
            
            if (currentSession.user) {
              const roles = await checkRolesWithTimeout(currentSession.user.id);
              
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
            } else {
              // If there's a session but no user, make sure loading is false
              setIsLoading(false);
            }
          } else {
            // If no session, make sure loading is false
            setIsLoading(false);
          }
        } else {
          // For other events, ensure loading state is updated
          setIsLoading(false);
        }
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
          const roles = await checkRolesWithTimeout(currentSession.user.id);
          
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
        } else {
          // Set loading to false if there's a session but no user
          setIsLoading(false);
        }
      } else {
        console.log("No session found on initial load");
        // No session, so we can set loading to false
        setIsLoading(false);
      }
    }).catch(error => {
      console.error("Error getting session:", error);
      // Make sure to set loading to false if there's an error
      setIsLoading(false);
    });

    // Cleanup function
    return () => {
      console.log("Cleaning up auth listener subscription");
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
      
      // Clear any timeout on unmount
      if (roleCheckTimeoutRef.current) {
        clearTimeout(roleCheckTimeoutRef.current);
        roleCheckTimeoutRef.current = null;
      }
    };
  }, [navigate, checkRolesWithTimeout]);

  const value = {
    session,
    user,
    isAdmin,
    isClient,
    isLoading,
    signIn,
    signUp,
    signOut,
    refreshRoles, // Added for manual refresh
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
