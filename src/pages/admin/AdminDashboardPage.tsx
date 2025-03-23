
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useToast } from "@/components/ui/use-toast";

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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Clients</CardTitle>
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
                <CardTitle>Orders</CardTitle>
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
                <CardTitle>Quote Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">Quotations</p>
                <p className="text-sm text-gray-500 mb-4">Handle custom quote requests</p>
                <Button 
                  onClick={() => navigate("/admin/quotes")} 
                  className="w-full"
                >
                  View Quotes
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="system">
            <TabsList className="mb-6">
              <TabsTrigger value="system">System Settings</TabsTrigger>
              <TabsTrigger value="content">Content Management</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="system" className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">System Settings</h2>
              <p className="mb-4">Configure system-wide settings and preferences.</p>
              <div className="space-y-4">
                <Button variant="outline" onClick={() => navigate("/admin/complete-dashboard")}>
                  Advanced Dashboard
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="content" className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Content Management</h2>
              <p>Manage website content, products, and pricing.</p>
            </TabsContent>
            
            <TabsContent value="analytics" className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Analytics</h2>
              <p>View reports and analytics data.</p>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
