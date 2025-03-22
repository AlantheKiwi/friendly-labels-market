
import React, { useEffect, useState, useCallback } from "react";
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
  
  // Memoize the refresh roles function to prevent recreating it on every render
  const handleRefreshRoles = useCallback(async () => {
    if (isRefreshing || !user) return;
    
    setIsRefreshing(true);
    try {
      await refreshRoles();
    } catch (error) {
      console.error("Auto-refresh roles error:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [user, refreshRoles, isRefreshing]);
  
  // If more than 60 seconds have passed since the last role check, refresh roles
  useEffect(() => {
    if (isLoading || !user || isRefreshing) return;
    
    const shouldRefresh = 
      lastRoleCheck && 
      Date.now() - lastRoleCheck > 60000 && // 60 seconds
      (requireAdmin || requireClient);
      
    if (shouldRefresh) {
      console.log("Auto-refreshing roles - stale role data detected");
      handleRefreshRoles();
    }
  }, [user, lastRoleCheck, handleRefreshRoles, requireAdmin, requireClient, isLoading, isRefreshing]);

  // Handle redirect logic in a separate effect to prevent render loops
  useEffect(() => {
    // Only determine redirect after loading is complete and not during refresh
    if (!isLoading && !isRefreshing) {
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

  // If still loading or refreshing, show a spinner
  if (isLoading || isRefreshing || shouldRedirect === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // If we should redirect
  if (shouldRedirect) {
    // No user is logged in, go to login page
    if (!user) {
      console.log("No user found, redirecting to login");
      
      // Don't show toast during initial redirect or when already on the auth pages
      const currentPath = window.location.pathname;
      if (!currentPath.includes("/auth/")) {
        toast({
          title: "Authentication required",
          description: "Please sign in to access this page",
          variant: "destructive"
        });
      }
      
      return <Navigate to="/auth/login" replace />;
    }
    
    // If admin access is required but user is not admin
    if (requireAdmin && !isAdmin) {
      console.log("Admin access required but user is not admin");
      toast({
        title: "Access denied",
        description: "You need administrator privileges to access this page",
        variant: "destructive"
      });
      return <Navigate to="/" replace />;
    }

    // If client access is required but user is not client
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

  // User has necessary permissions, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
