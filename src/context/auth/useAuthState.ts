
import { useState, useCallback, useRef, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { checkUserRoles, ensureClientRole } from "@/hooks/useRoleCheck";
import { AuthState } from "./authTypes";
import { UserRoles } from "@/types/auth";

export const useAuthState = (): AuthState & {
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  checkRolesWithTimeout: (userId: string) => Promise<UserRoles>;
} => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRoleCheck, setLastRoleCheck] = useState<number>(0);
  const { toast } = useToast();
  const roleCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const roleCheckInProgressRef = useRef<boolean>(false);

  // Helper function to check roles with improved logic
  const checkRolesWithTimeout = useCallback(async (userId: string): Promise<UserRoles> => {
    console.log("Starting role check with timeout for user:", userId);
    
    // Prevent concurrent role checks for the same user
    if (roleCheckInProgressRef.current) {
      console.log("Role check already in progress, using cached values");
      return { isAdmin, isClient };
    }
    
    roleCheckInProgressRef.current = true;
    
    // Clear any existing timeout to prevent race conditions
    if (roleCheckTimeoutRef.current) {
      clearTimeout(roleCheckTimeoutRef.current);
      roleCheckTimeoutRef.current = null;
    }
    
    // Set a timeout to ensure loading state is eventually set to false even if role check fails
    roleCheckTimeoutRef.current = setTimeout(() => {
      console.log("Role check timeout triggered - forcing loading to false");
      setIsLoading(false);
      roleCheckInProgressRef.current = false;
      
      // Set client to true as fallback to prevent access issues
      if (userId) {
        setIsClient(true);
      }
      
      // Show a toast when we hit the timeout
      toast({
        title: "Slow response",
        description: "Role check is taking longer than expected. Try refreshing.",
        variant: "destructive"
      });
    }, 5000); // 5 second timeout
    
    try {
      // Always attempt to ensure the client role first
      await ensureClientRole(userId);
      
      const roles = await checkUserRoles(userId);
      console.log("User roles determined:", roles);
      
      // Set the roles in state
      setIsAdmin(roles.isAdmin);
      setIsClient(roles.isClient);
      
      // Record when we last checked roles
      setLastRoleCheck(Date.now());
      
      // Clear the timeout since we got the roles successfully
      if (roleCheckTimeoutRef.current) {
        clearTimeout(roleCheckTimeoutRef.current);
        roleCheckTimeoutRef.current = null;
      }
      
      setIsLoading(false);
      roleCheckInProgressRef.current = false;
      return roles;
    } catch (error) {
      console.error("Error checking roles:", error);
      setIsLoading(false);
      
      // Clear the timeout if there was an error
      if (roleCheckTimeoutRef.current) {
        clearTimeout(roleCheckTimeoutRef.current);
        roleCheckTimeoutRef.current = null;
      }
      
      // Default to client role for authenticated users even if checks fail
      setIsClient(true);
      roleCheckInProgressRef.current = false;
      return { isAdmin: false, isClient: true };
    }
  }, [toast, isAdmin, isClient]);

  return {
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
  };
};
