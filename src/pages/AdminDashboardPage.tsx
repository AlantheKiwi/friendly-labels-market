
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminImageUpload from "@/components/admin/AdminImageUpload";
import AdminPrinterPricing from "@/components/admin/AdminPrinterPricing";
import AdminPasswordChange from "@/components/admin/AdminPasswordChange";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_EMAIL } from "@/services/auth/constants";

const AdminDashboardPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get tab from URL query params
  const queryParams = new URLSearchParams(location.search);
  const defaultTab = queryParams.get('tab') || 'images';

  // Check if current user is admin
  const checkAdminStatus = async () => {
    try {
      setLoading(true);
      
      // Get current session directly from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("No session found");
        setIsAdmin(false);
        toast({
          title: "Access Denied",
          description: "You need to log in to access this page",
          variant: "destructive",
        });
        navigate("/");
        return;
      }
      
      const userEmail = session.user?.email?.toLowerCase();
      
      // Direct admin check by email
      if (userEmail === ADMIN_EMAIL.toLowerCase()) {
        console.log("Admin email match found");
        setIsAdmin(true);
        setShowPasswordChange(localStorage.getItem("requirePasswordChange") === "true");
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

  const handlePasswordChangeComplete = () => {
    setShowPasswordChange(false);
    localStorage.setItem("requirePasswordChange", "false");
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully",
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-brand-blue border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />
      
      {showPasswordChange ? (
        <main className="flex-grow bg-gray-50 p-6">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Change Your Password</h2>
            <p className="mb-4 text-red-600">
              For security reasons, you must change your password before proceeding.
            </p>
            <AdminPasswordChange onComplete={handlePasswordChangeComplete} />
          </div>
        </main>
      ) : (
        <main className="flex-grow bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            
            <Tabs defaultValue={defaultTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="images">Printer Images</TabsTrigger>
                <TabsTrigger value="printers">Printer Pricing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="images" className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4">Manage Printer Images</h2>
                <AdminImageUpload />
              </TabsContent>
              
              <TabsContent value="printers" className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4">Manage Printer Pricing</h2>
                <AdminPrinterPricing />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      )}
    </div>
  );
};

export default AdminDashboardPage;
