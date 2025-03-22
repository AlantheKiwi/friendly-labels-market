
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import AdminHeader from "@/components/admin/AdminHeader";
import OrdersSection from "@/components/admin/dashboard/OrdersSection";
import PaymentsSection from "@/components/admin/dashboard/PaymentsSection";
import InvoicesSection from "@/components/admin/dashboard/InvoicesSection";
import TicketsSection from "@/components/admin/dashboard/TicketsSection";

const AdminCompleteDashboardPage = () => {
  const { isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    if (!loading && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You must be an admin to view this page",
        variant: "destructive"
      });
      navigate("/admin/login");
    }
  }, [isAdmin, loading, navigate, toast]);

  if (loading) {
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
          
          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="mb-6">
              <TabsTrigger value="orders">Client Orders</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
            </TabsList>
            
            <TabsContent value="orders">
              <OrdersSection />
            </TabsContent>
            
            <TabsContent value="payments">
              <PaymentsSection />
            </TabsContent>
            
            <TabsContent value="invoices">
              <InvoicesSection />
            </TabsContent>
            
            <TabsContent value="tickets">
              <TicketsSection />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminCompleteDashboardPage;
