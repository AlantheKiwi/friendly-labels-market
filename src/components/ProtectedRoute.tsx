
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

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
  const { user, isAdmin, isClient, isLoading } = useAuth();

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
    return <Navigate to="/auth/login" replace />;
  }

  // If admin access is required but user is not admin
  if (requireAdmin && !isAdmin) {
    console.log("Admin access required but user is not admin");
    return <Navigate to="/" replace />;
  }

  // If client access is required but user is not client
  if (requireClient && !isClient) {
    console.log("Client access required but user is not client");
    return <Navigate to="/" replace />;
  }

  // User has necessary permissions, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
