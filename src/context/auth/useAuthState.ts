
import { useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { AuthState } from "./authTypes";
import { UserRoles } from "@/types/auth";
import { useInitialAuthState } from "./hooks/useInitialAuthState";
import { useRoleCheck } from "./hooks/useRoleCheck";

export const useAuthState = (): AuthState & {
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setIsClient: (isClient: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  checkRolesWithTimeout: (userId: string) => Promise<UserRoles>;
} => {
  const {
    session,
    user,
    isAdmin,
    isClient,
    isLoading,
    lastRoleCheck,
    setSession,
    setUser,
    setIsAdmin,
    setIsClient,
    setIsLoading,
    setLastRoleCheck
  } = useInitialAuthState();

  const { toast } = useToast();
  
  // Get the role check functionality
  const { checkRolesWithTimeout, roleCheckTimeoutRef } = useRoleCheck(
    isAdmin,
    isClient,
    user,
    setIsAdmin,
    setIsClient,
    setIsLoading,
    setLastRoleCheck
  );

  // Clean up the timeout on unmount
  useEffect(() => {
    return () => {
      if (roleCheckTimeoutRef.current) {
        clearTimeout(roleCheckTimeoutRef.current);
        roleCheckTimeoutRef.current = null;
      }
    };
  }, []);

  return {
    session,
    user,
    isAdmin,
    isClient,
    isLoading,
    lastRoleCheck,
    setSession,
    setUser,
    setIsAdmin,
    setIsClient,
    setIsLoading,
    checkRolesWithTimeout
  };
};
