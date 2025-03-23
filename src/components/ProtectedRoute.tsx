
import React, { useEffect, useState, useCallback, useRef } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

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
  const { user, isAdmin, isClient, isLoading, refreshRoles, lastRoleCheck } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState<boolean | null>(null);
  const { toast } = useToast();
  const redirectAttempted = useRef(false);
  
  const handleRefreshRoles = useCallback(async () => {
    if (isRefreshing || !user) return;
    
    setIsRefreshing(true);
    try {
      console.log("Explicitly refreshing user roles");
      await refreshRoles();
    } catch (error) {
      console.error("Auto-refresh roles error:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [user, refreshRoles, isRefreshing]);
  
  // Force role refresh on mount for admin pages
  useEffect(() => {
    if (requireAdmin && user && !isRefreshing && !isLoading) {
      console.log("Admin page - forcing role refresh");
      handleRefreshRoles();
    }
  }, [requireAdmin, user, handleRefreshRoles, isRefreshing, isLoading]);
  
  useEffect(() => {
    if (isLoading || !user || isRefreshing) return;
    
    const shouldRefresh = 
      lastRoleCheck && 
      Date.now() - lastRoleCheck > 30000 && // Reduced to 30 seconds for more frequent checks
      (requireAdmin || requireClient);
      
    if (shouldRefresh) {
      console.log("Auto-refreshing roles - stale role data detected");
      handleRefreshRoles();
    }
  }, [user, lastRoleCheck, handleRefreshRoles, requireAdmin, requireClient, isLoading, isRefreshing]);

  useEffect(() => {
    if (!isLoading && !isRefreshing) {
      console.log("ProtectedRoute checking access:", { 
        user: !!user, 
        requireAdmin, 
        isAdmin, 
        requireClient, 
        isClient 
      });
      
      if (!user) {
        setShouldRedirect(true);
      } else if (
        (requireAdmin && !isAdmin) || 
        (requireClient && !isClient)
      ) {
        setShouldRedirect(true);
      } else {
        setShouldRedirect(false);
      }
    }
  }, [user, isAdmin, isClient, isLoading, isRefreshing, requireAdmin, requireClient]);

  if (isLoading || isRefreshing || shouldRedirect === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (shouldRedirect && !redirectAttempted.current) {
    redirectAttempted.current = true;
    
    if (!user) {
      console.log("No user found, redirecting to login");
      
      const currentPath = window.location.pathname;
      if (!currentPath.includes("/auth/")) {
        toast({
          title: "Authentication required",
          description: "Please sign in to access this page",
          variant: "destructive"
        });
      }
      
      if (requireAdmin && window.location.pathname.includes("/admin/")) {
        return <Navigate to="/admin/login" replace />;
      } else {
        return <Navigate to="/auth/login" replace />;
      }
    }
    
    if (requireAdmin && !isAdmin) {
      console.log("Admin access required but user is not admin");
      toast({
        title: "Access denied",
        description: "You need administrator privileges to access this page",
        variant: "destructive"
      });
      return <Navigate to="/" replace />;
    }

    if (requireClient && !isClient) {
      console.log("Client access required but user is not client");
      toast({
        title: "Access denied",
        description: "You need client privileges to access this page",
        variant: "destructive"
      });
      return <Navigate to="/" replace />;
    }
  }

  if (!shouldRedirect) {
    redirectAttempted.current = false;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
