
import { Session, User } from "@supabase/supabase-js";

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  isClient: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  refreshRoles: () => Promise<UserRoles>; // Added for manual role refresh
  lastRoleCheck: number; // Timestamp of last role check
};

export type UserRoles = {
  isAdmin: boolean;
  isClient: boolean;
};
