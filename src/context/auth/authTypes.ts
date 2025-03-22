
import { Session, User } from "@supabase/supabase-js";
import { UserRoles } from "@/types/auth";

export interface AuthState {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  isClient: boolean;
  isLoading: boolean;
  lastRoleCheck: number;
}

export interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  refreshRoles: () => Promise<UserRoles>;
}

export type AuthContextType = AuthState & AuthActions;
