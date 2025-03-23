
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { UserRoles } from "@/types/auth";
import { ADMIN_EMAIL } from "@/services/auth/constants";

interface UseSessionCheckProps {
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setIsClient: (isClient: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  checkRolesWithTimeout: (userId: string) => Promise<UserRoles>;
}

export const useSessionCheck = ({
  setSession,
  setUser,
  setIsAdmin,
  setIsClient,
  setIsLoading,
  checkRolesWithTimeout
}: UseSessionCheckProps) => {
  const navigate = useNavigate();
  const initialCheckDoneRef = useRef(false);
  const redirectInProgressRef = useRef(false);

  // Check for existing session
  useEffect(() => {
    // Only run once
    if (initialCheckDoneRef.current) {
      return;
    }
    
    initialCheckDoneRef.current = true;
    
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession?.user?.id);
      
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
              if (currentPath === "/" || 
                  currentPath === "/auth/login" || 
                  currentPath === "/auth/register" ||
                  currentPath.startsWith("/client/")) {
                  console.log("Admin detected - redirecting to admin dashboard");
                  navigate("/admin/dashboard", { replace: true });
              }
              setIsLoading(false);
              return;
            }
            
            // Check roles with timeout - prevent multiple redirects
            if (!redirectInProgressRef.current) {
              redirectInProgressRef.current = true;
              
              const roles = await checkRolesWithTimeout(currentSession.user.id);
              setIsAdmin(roles.isAdmin);
              setIsClient(roles.isClient);
              
              // FIXED: Only redirect if not already on a protected route
              const currentPath = window.location.pathname;
              if ((currentPath === "/" || 
                  currentPath === "/auth/login" || 
                  currentPath === "/auth/register") &&
                  !currentPath.startsWith("/client/") &&
                  !currentPath.startsWith("/admin/")) {
                if (roles.isAdmin) {
                  console.log("Initial load - redirecting admin to dashboard");
                  navigate("/admin/dashboard", { replace: true });
                } else if (roles.isClient) {
                  console.log("Initial load - redirecting client to dashboard");
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
  }, [navigate, checkRolesWithTimeout, setSession, setUser, setIsAdmin, setIsClient, setIsLoading]);
};
