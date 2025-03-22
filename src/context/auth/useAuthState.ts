
import { useState, useCallback, useRef } from "react";
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

  // Helper function to check roles with improved logic
  const checkRolesWithTimeout = useCallback(async (userId: string): Promise<UserRoles> => {
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
