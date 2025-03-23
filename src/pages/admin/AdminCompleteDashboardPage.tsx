
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const AdminCompleteDashboardPage = () => {
  const { user, isAdmin, isLoading, refreshRoles } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Redirect non-admin users to login
    if (!isLoading && (!user || !isAdmin)) {
      console.log("User is not admin, redirecting to login page");
      toast({
        title: "Access Denied",
        description: "You need to log in as an administrator to access this page",
        variant: "destructive",
      });
      navigate("/admin/login");
    }
  }, [user, isAdmin, isLoading, navigate, toast]);

  const handleManualRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      console.log("Manually refreshing admin status");
      await refreshRoles();
      
      toast({
        title: "Refreshed",
        description: "Your admin status has been refreshed",
      });
    } catch (error) {
      console.error("Error refreshing roles:", error);
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh your admin status",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading || isRefreshing) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Only render the dashboard if the user is admin
  if (!user || !isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Complete Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh Admin Status
            </Button>
            <AdminLogoutButton />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-lg">
            Welcome to the complete admin dashboard. You are successfully logged in as an administrator.
          </p>
          <div className="mt-4 p-4 bg-amber-50 rounded border border-amber-200">
            <h2 className="font-semibold text-amber-800">Admin User Information</h2>
            <p className="text-sm text-amber-700 mt-2">Email: {user.email}</p>
            <p className="text-sm text-amber-700">User ID: {user.id}</p>
            <p className="text-sm text-amber-700">Admin Status: {isAdmin ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCompleteDashboardPage;
