
import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface UseAuthListenersProps {
  setSession: (session: any) => void;
  setUser: (user: any) => void; 
  setIsAdmin: (isAdmin: boolean) => void;
  setIsClient: (isClient: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  checkRolesWithTimeout: (userId: string) => Promise<any>;
}

export const useAuthListeners = ({
  setSession,
  setUser,
  setIsAdmin,
  setIsClient,
  setIsLoading,
  checkRolesWithTimeout
}: UseAuthListenersProps) => {
  const navigate = useNavigate();
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);
  const initialCheckDoneRef = useRef(false);
  const redirectInProgressRef = useRef(false);

  // Setup auth listeners and initial session check
  useEffect(() => {
    console.log("Setting up auth listener");
    
    // Prevent duplicate initial session checks
    if (initialCheckDoneRef.current) {
      return;
    }
    
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
                // Set a default client role immediately for better UX while roles are checked
                setIsClient(true);
                
                // Don't redirect if already in progress
                if (!redirectInProgressRef.current) {
                  redirectInProgressRef.current = true;
                  
                  const roles = await checkRolesWithTimeout(currentSession.user.id);
                  
                  // Redirect if on login or register page
                  const currentPath = window.location.pathname;
                  if (currentPath === "/auth/login" || currentPath === "/auth/register") {
                    if (roles.isClient) {
                      console.log("Auth state change - redirecting client to dashboard");
                      navigate("/client/dashboard", { replace: true });
                    } else if (roles.isAdmin) {
                      console.log("Auth state change - redirecting admin to dashboard");
                      navigate("/admin/dashboard", { replace: true });
                    }
                  }
                  
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
    
    // Store subscription reference for cleanup
    subscriptionRef.current = data.subscription;
    
    // Then check for existing session - only once
    initialCheckDoneRef.current = true;
    
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession?.user?.id);
      
      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
        
        if (currentSession.user) {
          try {
            // Set a default client role immediately for better UX while roles are checked
            setIsClient(true);
            
            // Don't redirect if already in progress
            if (!redirectInProgressRef.current) {
              redirectInProgressRef.current = true;
              
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
              
              redirectInProgressRef.current = false;
            }
          } catch (error) {
            console.error("Error checking roles in initial session:", error);
            setIsLoading(false);
            redirectInProgressRef.current = false;
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
      redirectInProgressRef.current = false;
    });

    // Cleanup function
    return () => {
      console.log("Cleaning up auth listener subscription");
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [navigate, checkRolesWithTimeout, setSession, setUser, setIsAdmin, setIsClient, setIsLoading]);
};
