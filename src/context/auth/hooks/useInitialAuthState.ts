
import { useState } from "react";
import { Session, User } from "@supabase/supabase-js";

export const useInitialAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRoleCheck, setLastRoleCheck] = useState<number>(0);
  
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
    setLastRoleCheck
  };
};
