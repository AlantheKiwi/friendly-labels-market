
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  isClient: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Function to check user roles
  const checkUserRoles = async (userId: string) => {
    try {
      const { data: adminRole } = await supabase.rpc('has_role', {
        user_id: userId,
        role: 'admin'
      });
      
      const { data: clientRole } = await supabase.rpc('has_role', {
        user_id: userId,
        role: 'client'
      });
      
      setIsAdmin(!!adminRole);
      setIsClient(!!clientRole);
    } catch (error) {
      console.error("Error checking roles:", error);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          await checkUserRoles(currentSession.user.id);
          
          // Redirect if on login or register page
          const currentPath = window.location.pathname;
          if (currentPath === "/auth/login" || currentPath === "/auth/register") {
            const { data: clientRole } = await supabase.rpc('has_role', {
              user_id: currentSession.user.id,
              role: 'client'
            });
            
            const { data: adminRole } = await supabase.rpc('has_role', {
              user_id: currentSession.user.id,
              role: 'admin'
            });
            
            if (clientRole) {
              navigate("/client/dashboard");
            } else if (adminRole) {
              navigate("/admin/dashboard");
            } else {
              navigate("/");
            }
          }
        } else {
          setIsAdmin(false);
          setIsClient(false);
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        await checkUserRoles(currentSession.user.id);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Signed in successfully",
        description: "Welcome back!",
      });
      
      // Get user roles after sign in to determine redirect
      const { data: userData } = await supabase.auth.getUser();
      
      if (userData.user) {
        const { data: clientRole } = await supabase.rpc('has_role', {
          user_id: userData.user.id,
          role: 'client'
        });
        
        const { data: adminRole } = await supabase.rpc('has_role', {
          user_id: userData.user.id,
          role: 'admin'
        });
        
        if (clientRole) {
          navigate("/client/dashboard");
        } else if (adminRole) {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Account created",
        description: "Please check your email to verify your account",
      });
      
      navigate("/auth/login");
    } catch (error) {
      console.error("Sign up error:", error);
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Sign out failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const value = {
    session,
    user,
    isAdmin,
    isClient,
    isLoading,
    signIn,
    signUp,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
