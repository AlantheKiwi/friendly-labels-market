
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import OrdersTable from "@/components/admin/orders/OrdersTable";
import OrderSearch from "@/components/admin/orders/OrderSearch";
import AddOrderDialog from "@/components/admin/orders/AddOrderDialog";
import OrderStatusBadge from "@/components/admin/orders/OrderStatusBadge";
import { useOrders } from "@/hooks/useOrders";

const AdminOrdersPage = () => {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    orders,
    clients,
    formData,
    isLoading,
    isPending,
    handleInputChange,
    handleSelectChange,
    addOrder,
    resetForm
  } = useOrders(isAdmin);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addOrder(formData);
    setIsDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    return <OrderStatusBadge status={status} />;
  };

  const filteredOrders = orders?.filter(order => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      order.order_number.toLowerCase().includes(searchLower) ||
      order.product_name.toLowerCase().includes(searchLower) ||
      (order.client.company && order.client.company.toLowerCase().includes(searchLower)) ||
      `${order.client.first_name} ${order.client.last_name}`.toLowerCase().includes(searchLower)
    );
  });

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "Please log in to access the admin dashboard",
        variant: "destructive",
      });
      navigate("/admin/login");
    }
  }, [isAdmin, authLoading, navigate, toast]);

  if (authLoading || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Order Management</h1>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add New Order
            </Button>
          </div>
          
          <div className="mb-6">
            <OrderSearch 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <OrdersTable 
                orders={filteredOrders || []} 
                getStatusBadge={getStatusBadge} 
              />
            </CardContent>
          </Card>
        </div>
      </main>

      <AddOrderDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        clients={clients || []}
        onSubmit={handleSubmit}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        isSubmitting={isPending}
      />
    </div>
  );
};

export default AdminOrdersPage;
