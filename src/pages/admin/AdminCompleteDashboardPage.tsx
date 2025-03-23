
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_EMAIL } from "@/services/auth/constants";

const AdminCompleteDashboardPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if current user is admin
  const checkAdminStatus = async () => {
    try {
      setLoading(true);
      
      // Get current session directly from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("No session found");
        setIsAdmin(false);
        setAdminEmail(null);
        toast({
          title: "Access Denied",
          description: "You need to log in to access this page",
          variant: "destructive",
        });
        navigate("/");
        return;
      }
      
      const userEmail = session.user?.email?.toLowerCase();
      setAdminEmail(userEmail || null);
      
      // Direct admin check by email
      if (userEmail === ADMIN_EMAIL.toLowerCase()) {
        console.log("Admin email match found");
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        toast({
          title: "Access Denied",
          description: "You need admin privileges to access this page",
          variant: "destructive",
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, [navigate, toast]);

  const handleManualRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      console.log("Manually refreshing admin status");
      await checkAdminStatus();
      
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

  if (loading || isRefreshing) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Only render the dashboard if the user is admin
  if (!isAdmin) {
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
            <p className="text-sm text-amber-700 mt-2">Email: {adminEmail}</p>
            <p className="text-sm text-amber-700">Admin Status: {isAdmin ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCompleteDashboardPage;
