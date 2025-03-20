
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminImageUpload from "@/components/admin/AdminImageUpload";
import AdminPrinterPricing from "@/components/admin/AdminPrinterPricing";
import AdminProductPricing from "@/components/admin/AdminProductPricing";
import AdminPasswordChange from "@/components/admin/AdminPasswordChange";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const AdminDashboardPage = () => {
  const { isAdmin, requirePasswordChange, loading, adminEmail } = useAdminAuth();
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set password change requirement based on auth
    setShowPasswordChange(requirePasswordChange);
    
    if (!loading && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "Please log in to access the admin dashboard",
        variant: "destructive",
      });
      navigate("/admin/login");
    }
  }, [isAdmin, requirePasswordChange, loading, navigate, toast]);

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
            
            <Tabs defaultValue="images">
              <TabsList className="mb-6">
                <TabsTrigger value="images">Printer Images</TabsTrigger>
                <TabsTrigger value="printers">Printer Pricing</TabsTrigger>
                <TabsTrigger value="products">Product Pricing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="images" className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4">Manage Printer Images</h2>
                <AdminImageUpload />
              </TabsContent>
              
              <TabsContent value="printers" className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4">Manage Printer Pricing</h2>
                <AdminPrinterPricing />
              </TabsContent>
              
              <TabsContent value="products" className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4">Manage Product Pricing</h2>
                <AdminProductPricing />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      )}
    </div>
  );
};

export default AdminDashboardPage;
