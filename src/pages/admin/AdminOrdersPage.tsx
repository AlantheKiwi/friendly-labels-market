
import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useOrders } from "@/hooks/useOrders";
import OrdersPageHeader from "@/components/admin/orders/OrdersPageHeader";
import OrdersContent from "@/components/admin/orders/OrdersContent";
import OrderDialogManager from "@/components/admin/orders/OrderDialogManager";

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
    filters,
    isLoading,
    isPending,
    handleInputChange,
    handleSelectChange,
    handleFilterChange,
    addOrder,
    updateOrder,
    editOrder,
    setIsEditMode,
    resetForm
  } = useOrders(isAdmin);

  const handleEditOrderClick = (order: any) => {
    editOrder(order);
    setIsEditDialogOpen(true);
  };

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
          <OrdersPageHeader onAddOrder={() => setIsAddDialogOpen(true)} />
          
          <OrdersContent 
            orders={orders || []}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filters={filters}
            handleFilterChange={handleFilterChange}
            onEditOrder={handleEditOrderClick}
          />
        </div>
      </main>

      <OrderDialogManager 
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        clients={clients || []}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        addOrder={addOrder}
        updateOrder={updateOrder}
        isPending={isPending}
        resetForm={resetForm}
      />
    </div>
  );
};

export default AdminOrdersPage;
