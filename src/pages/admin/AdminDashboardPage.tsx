
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useToast } from "@/components/ui/use-toast";
import OrdersSection from "@/components/admin/dashboard/OrdersSection";
import InvoicesSection from "@/components/admin/dashboard/InvoicesSection";
import PaymentsSection from "@/components/admin/dashboard/PaymentsSection";
import ClientsSection from "@/components/admin/dashboard/ClientsSection";
import { Users, FileText, CreditCard, ShoppingCart } from "lucide-react";

const AdminDashboardPage: React.FC = () => {
  const { isAdmin, isLoading, adminEmail } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      toast({
        title: "Access denied",
        description: "You do not have admin privileges.",
        variant: "destructive"
      });
      navigate("/", { replace: true });
    }
  }, [isAdmin, isLoading, navigate, toast]);

  if (isLoading) {
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
      <main className="flex-grow bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Clients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">Management</p>
                <p className="text-sm text-gray-500 mb-4">View and manage client accounts</p>
                <Button 
                  onClick={() => navigate("/admin/clients")} 
                  className="w-full"
                >
                  Manage Clients
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">Processing</p>
                <p className="text-sm text-gray-500 mb-4">Manage orders and fulfillment</p>
                <Button 
                  onClick={() => navigate("/admin/orders")} 
                  className="w-full"
                >
                  View Orders
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Invoices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">Billing</p>
                <p className="text-sm text-gray-500 mb-4">Manage invoices and payments</p>
                <Button 
                  className="w-full"
                  onClick={() => navigate("/admin/invoices")}
                >
                  View Invoices
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">Transactions</p>
                <p className="text-sm text-gray-500 mb-4">Monitor payment transactions</p>
                <Button 
                  className="w-full"
                  onClick={() => navigate("/admin/payments")}
                >
                  View Payments
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="orders">
            <TabsList className="mb-6">
              <TabsTrigger value="orders">Recent Orders</TabsTrigger>
              <TabsTrigger value="invoices">Recent Invoices</TabsTrigger>
              <TabsTrigger value="payments">Recent Payments</TabsTrigger>
              <TabsTrigger value="clients">Client Directory</TabsTrigger>
            </TabsList>
            
            <TabsContent value="orders" className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
              <OrdersSection />
            </TabsContent>
            
            <TabsContent value="invoices" className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Recent Invoices</h2>
              <InvoicesSection />
            </TabsContent>
            
            <TabsContent value="payments" className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Recent Payments</h2>
              <PaymentsSection />
            </TabsContent>
            
            <TabsContent value="clients" className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Client Directory</h2>
              <ClientsSection />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
