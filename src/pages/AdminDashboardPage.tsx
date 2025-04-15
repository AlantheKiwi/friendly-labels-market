
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminPrinterPricing from "@/components/admin/AdminPrinterPricing";
import AdminProductPricing from "@/components/admin/AdminProductPricing";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import { useNavigate } from "react-router-dom";

const AdminDashboardPage = () => {
  const { isAdmin, isLoading } = useRoleCheck();
  const [activeTab, setActiveTab] = useState("printers");
  const navigate = useNavigate();

  // Redirect if not admin
  if (!isLoading && !isAdmin) {
    navigate("/auth/login");
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-12 w-12 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500">Manage prices, products and printer settings</p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="printers">Printer Pricing</TabsTrigger>
            <TabsTrigger value="products">Product Pricing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="printers" className="space-y-4">
            <AdminPrinterPricing />
          </TabsContent>
          
          <TabsContent value="products" className="space-y-4">
            <AdminProductPricing />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
