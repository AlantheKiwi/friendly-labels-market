
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
import EditOrderDialog from "@/components/admin/orders/EditOrderDialog";
import OrderStatusBadge from "@/components/admin/orders/OrderStatusBadge";
import { useOrders } from "@/hooks/useOrders";

const AdminOrdersPage = () => {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    orders,
    clients,
    formData,
    isEditMode,
    isLoading,
    isPending,
    handleInputChange,
    handleSelectChange,
    addOrder,
    updateOrder,
    editOrder,
    setIsEditMode,
    resetForm
  } = useOrders(isAdmin);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addOrder(formData);
    setIsAddDialogOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrder(formData);
    setIsEditDialogOpen(false);
  };

  const handleEditOrderClick = (order: any) => {
    editOrder(order);
    setIsEditDialogOpen(true);
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

  // Reset form when dialogs are closed
  useEffect(() => {
    if (!isAddDialogOpen && !isEditDialogOpen) {
      resetForm();
    }
  }, [isAddDialogOpen, isEditDialogOpen]);

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
            <Button onClick={() => setIsAddDialogOpen(true)}>
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
                onEditOrder={handleEditOrderClick}
              />
            </CardContent>
          </Card>
        </div>
      </main>

      <AddOrderDialog 
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        clients={clients || []}
        onSubmit={handleAddSubmit}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        isSubmitting={isPending}
      />

      <EditOrderDialog 
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        clients={clients || []}
        onSubmit={handleEditSubmit}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        isSubmitting={isPending}
      />
    </div>
  );
};

export default AdminOrdersPage;
