
import React, { useEffect, useState, useCallback, useRef } from "react";
import { Navigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_EMAIL } from "@/services/auth/constants";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireClient?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  requireClient = false 
}) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState<boolean | null>(null);
  const { toast } = useToast();
  const redirectAttempted = useRef(false);
  
  // Check auth status directly without relying on context
  const checkAuthStatus = useCallback(async () => {
    try {
      console.log("Checking auth status in ProtectedRoute");
      
      // Get current session directly from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("No session found in ProtectedRoute");
        setIsAdmin(false);
        setIsClient(false);
        return false;
      }
      
      const userEmail = session.user?.email?.toLowerCase();
      
      // Direct admin check by email
      if (userEmail === ADMIN_EMAIL.toLowerCase()) {
        console.log("Admin email match found in ProtectedRoute");
        setIsAdmin(true);
        setIsClient(true); // Admin has client privileges too
        return true;
      } else {
        // Regular user, always set as client for now
        setIsAdmin(false);
        setIsClient(true);
        return true;
      }
      
    } catch (error) {
      console.error("Error checking auth in ProtectedRoute:", error);
      return false;
    }
  }, []);
  
  // Check auth on mount
  useEffect(() => {
    async function initialAuthCheck() {
      setIsLoading(true);
      await checkAuthStatus();
      setIsLoading(false);
    }
    
    initialAuthCheck();
  }, [checkAuthStatus]);
  
  // Determine if redirect is needed when auth status changes
  useEffect(() => {
    if (!isLoading) {
      console.log("ProtectedRoute checking access:", { 
        hasSession: isAdmin || isClient, 
        requireAdmin, 
        isAdmin, 
        requireClient, 
        isClient 
      });
      
      if (!isAdmin && !isClient) {
        setShouldRedirect(true);
      } else if ((requireAdmin && !isAdmin) || (requireClient && !isClient)) {
        setShouldRedirect(true);
      } else {
        setShouldRedirect(false);
      }
    }
  }, [isAdmin, isClient, isLoading, requireAdmin, requireClient]);

  // Show loading state
  if (isLoading || shouldRedirect === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Handle redirects
  if (shouldRedirect && !redirectAttempted.current) {
    redirectAttempted.current = true;
    
    if (!isAdmin && !isClient) {
      console.log("No user found, redirecting to login");
      
      const currentPath = window.location.pathname;
      if (!currentPath.includes("/auth/")) {
        setTimeout(() => {
          toast({
            title: "Authentication required",
            description: "Please sign in to access this page",
            variant: "destructive"
          });
        }, 0);
      }
      
      if (requireAdmin && window.location.pathname.includes("/admin/")) {
        return <Navigate to="/admin/login" replace />;
      } else {
        return <Navigate to="/auth/login" replace />;
      }
    }
    
    if (requireAdmin && !isAdmin) {
      console.log("Admin access required but user is not admin");
      setTimeout(() => {
        toast({
          title: "Access denied",
          description: "You need administrator privileges to access this page",
          variant: "destructive"
        });
      }, 0);
      return <Navigate to="/" replace />;
    }

    if (requireClient && !isClient) {
      console.log("Client access required but user is not client");
      setTimeout(() => {
        toast({
          title: "Access denied",
          description: "You need client privileges to access this page",
          variant: "destructive"
        });
      }, 0);
      return <Navigate to="/" replace />;
    }
  }

  if (!shouldRedirect) {
    redirectAttempted.current = false;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
