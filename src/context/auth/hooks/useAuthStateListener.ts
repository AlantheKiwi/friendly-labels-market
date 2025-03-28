
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { UserRoles } from "@/types/auth";
import { ADMIN_EMAIL } from "@/services/auth/constants";

interface UseAuthStateListenerProps {
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setIsClient: (isClient: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  checkRolesWithTimeout: (userId: string) => Promise<UserRoles>;
}

export const useAuthStateListener = ({
  setSession,
  setUser,
  setIsAdmin,
  setIsClient,
  setIsLoading,
  checkRolesWithTimeout
}: UseAuthStateListenerProps) => {
  const navigate = useNavigate();
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);
  const redirectInProgressRef = useRef(false);

  // Setup auth state change listener
  useEffect(() => {
    console.log("Setting up auth listener");
    
    // Set up auth state listener
    try {
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
            
            // Don't force reload on sign out to prevent potential loops
            if (window.location.pathname !== "/" && !window.location.pathname.includes("/auth/")) {
              navigate("/", { replace: true });
            }
          } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            console.log(`${event} event received, updating session`);
            
            if (currentSession) {
              setSession(currentSession);
              setUser(currentSession.user);
              
              if (currentSession.user) {
                try {
                  // Set loading to true before checking roles
                  setIsLoading(true);
                  
                  // Check if user is admin by email first
                  const userEmail = currentSession.user.email?.toLowerCase();
                  if (userEmail === ADMIN_EMAIL.toLowerCase()) {
                    console.log("Admin email match found - direct admin access granted");
                    setIsAdmin(true);
                    setIsClient(false); // Admin is not a client
                    
                    const currentPath = window.location.pathname;
                    if (currentPath === "/auth/login" || 
                        currentPath === "/auth/register" ||
                        currentPath.startsWith("/client/")) {
                        console.log("Admin detected - redirecting to admin dashboard");
                        navigate("/admin/dashboard", { replace: true });
                    }
                    setIsLoading(false);
                    return;
                  }
                  
                  // Check roles with timeout
                  if (!redirectInProgressRef.current) {
                    redirectInProgressRef.current = true;
                    
                    const roles = await checkRolesWithTimeout(currentSession.user.id);
                    setIsAdmin(roles.isAdmin);
                    setIsClient(roles.isClient);
                    
                    // Redirect if on login or register page
                    const currentPath = window.location.pathname;
                    if (currentPath === "/auth/login" || currentPath === "/auth/register") {
                      if (roles.isAdmin) {
                        console.log("Auth state change - redirecting admin to dashboard");
                        navigate("/admin/dashboard", { replace: true });
                      } else if (roles.isClient) {
                        console.log("Auth state change - redirecting client to dashboard");
                        navigate("/client/dashboard", { replace: true });
                      }
                    } else if (roles.isAdmin && currentPath.startsWith("/client/")) {
                      // If admin is on client pages, redirect to admin dashboard
                      console.log("Admin on client page - redirecting to admin dashboard");
                      navigate("/admin/dashboard", { replace: true });
                    }
                    
                    setIsLoading(false);
                    redirectInProgressRef.current = false;
                  }
                } catch (error) {
                  console.error("Error checking roles in auth listener:", error);
                  setIsLoading(false);
                  redirectInProgressRef.current = false;
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
      
      // Store subscription reference for cleanup - ensure it has unsubscribe method
      if (data && typeof data.subscription?.unsubscribe === 'function') {
        subscriptionRef.current = { 
          unsubscribe: () => data.subscription.unsubscribe() 
        };
      } else {
        console.warn("Supabase subscription doesn't have expected unsubscribe method");
        subscriptionRef.current = null;
      }
    } catch (error) {
      console.error("Error setting up auth listener:", error);
      subscriptionRef.current = null;
    }

    // Cleanup function
    return () => {
      console.log("Cleaning up auth listener subscription");
      if (subscriptionRef.current && typeof subscriptionRef.current.unsubscribe === 'function') {
        try {
          subscriptionRef.current.unsubscribe();
        } catch (error) {
          console.error("Error during subscription cleanup:", error);
        }
        subscriptionRef.current = null;
      }
    };
  }, [navigate, checkRolesWithTimeout, setSession, setUser, setIsAdmin, setIsClient, setIsLoading]);
};
