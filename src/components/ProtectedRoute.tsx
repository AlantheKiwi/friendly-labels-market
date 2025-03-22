
import React, { useEffect } from "react";
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
  const { toast } = useToast();
  
  // If more than 60 seconds have passed since the last role check, refresh roles
  useEffect(() => {
    const shouldRefresh = 
      user && 
      lastRoleCheck && 
      Date.now() - lastRoleCheck > 60000 && // 60 seconds
      (requireAdmin || requireClient);
      
    if (shouldRefresh) {
      console.log("Auto-refreshing roles - stale role data detected");
      refreshRoles().catch(error => {
        console.error("Auto-refresh roles error:", error);
      });
    }
  }, [user, lastRoleCheck, refreshRoles, requireAdmin, requireClient]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // If no user is logged in, redirect to login
  if (!user) {
    console.log("No user found, redirecting to login");
    toast({
      title: "Authentication required",
      description: "Please sign in to access this page",
      variant: "destructive"
    });
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

  // User has necessary permissions, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
