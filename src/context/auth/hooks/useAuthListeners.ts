
import { useSessionCheck } from "./useSessionCheck";
import { useAuthStateListener } from "./useAuthStateListener";
import { Session, User } from "@supabase/supabase-js";
import { UserRoles } from "@/types/auth";

interface UseAuthListenersProps {
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void; 
  setIsAdmin: (isAdmin: boolean) => void;
  setIsClient: (isClient: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  checkRolesWithTimeout: (userId: string) => Promise<UserRoles>;
}

export const useAuthListeners = (props: UseAuthListenersProps) => {
  // Set up auth state listener
  useAuthStateListener(props);
  
  // Check initial session
  useSessionCheck(props);
};
