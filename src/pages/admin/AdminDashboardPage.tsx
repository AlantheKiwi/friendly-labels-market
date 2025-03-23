
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminHeader from "@/components/admin/AdminHeader";
import OrdersSection from "@/components/admin/dashboard/OrdersSection";
import PaymentsSection from "@/components/admin/dashboard/PaymentsSection";
import InvoicesSection from "@/components/admin/dashboard/InvoicesSection";
import TicketsSection from "@/components/admin/dashboard/TicketsSection";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const AdminDashboardPage = () => {
  const { isAdmin, isLoading } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("orders");

  // Redirect if not admin
  React.useEffect(() => {
    if (!isLoading && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You must be an admin to view this page",
        variant: "destructive"
      });
      navigate("/admin/login");
    }
  }, [isAdmin, isLoading, navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />
      
      <main className="flex-grow bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          
          <Tabs defaultValue="orders" onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="orders">Client Orders</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
            </TabsList>
            
            <TabsContent value="orders" className="bg-white p-6 rounded-lg shadow">
              <OrdersSection />
            </TabsContent>
            
            <TabsContent value="payments" className="bg-white p-6 rounded-lg shadow">
              <PaymentsSection />
            </TabsContent>
            
            <TabsContent value="invoices" className="bg-white p-6 rounded-lg shadow">
              <InvoicesSection />
            </TabsContent>
            
            <TabsContent value="tickets" className="bg-white p-6 rounded-lg shadow">
              <TicketsSection />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
