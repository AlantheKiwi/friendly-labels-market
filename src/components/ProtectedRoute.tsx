
import React, { useEffect, useState } from "react";
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
  const [showRedirect, setShowRedirect] = useState(false);
  const { toast } = useToast();
  
  // If more than 60 seconds have passed since the last role check, refresh roles
  useEffect(() => {
    if (isLoading) return;
    
    const shouldRefresh = 
      user && 
      lastRoleCheck && 
      Date.now() - lastRoleCheck > 60000 && // 60 seconds
      (requireAdmin || requireClient) &&
      !isRefreshing;
      
    if (shouldRefresh) {
      console.log("Auto-refreshing roles - stale role data detected");
      setIsRefreshing(true);
      refreshRoles().then(() => {
        setIsRefreshing(false);
      }).catch(error => {
        console.error("Auto-refresh roles error:", error);
        setIsRefreshing(false);
      });
    }

    // Only set showRedirect after we've determined loading is complete
    if (!isLoading && !user) {
      setShowRedirect(true);
    }
  }, [user, lastRoleCheck, refreshRoles, requireAdmin, requireClient, isRefreshing, isLoading]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // If no user is logged in, redirect to login
  if (showRedirect && !user) {
    console.log("No user found, redirecting to login");
    // Use a setTimeout to prevent the toast from being called during render
    setTimeout(() => {
      toast({
        title: "Authentication required",
        description: "Please sign in to access this page",
        variant: "destructive"
      });
    }, 0);
    return <Navigate to="/auth/login" replace />;
  }

  // If admin access is required but user is not admin
  if (user && requireAdmin && !isAdmin) {
    console.log("Admin access required but user is not admin");
    // Use a setTimeout to prevent the toast from being called during render
    setTimeout(() => {
      toast({
        title: "Access denied",
        description: "You need administrator privileges to access this page",
        variant: "destructive"
      });
    }, 0);
    return <Navigate to="/" replace />;
  }

  // If client access is required but user is not client
  if (user && requireClient && !isClient) {
    console.log("Client access required but user is not client");
    // Use a setTimeout to prevent the toast from being called during render
    setTimeout(() => {
      toast({
        title: "Access denied",
        description: "You need client privileges to access this page",
        variant: "destructive"
      });
    }, 0);
    return <Navigate to="/" replace />;
  }

  // User has necessary permissions, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
