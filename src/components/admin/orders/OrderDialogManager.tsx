
import React, { useEffect } from "react";
import AddOrderDialog from "./AddOrderDialog";
import EditOrderDialog from "./EditOrderDialog";
import { OrderFormData } from "@/types/order.types";

interface OrderDialogManagerProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  clients: any[];
  formData: OrderFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (field: string, value: string) => void;
  addOrder: (formData: OrderFormData) => void;
  updateOrder: (formData: OrderFormData) => void;
  isPending: boolean;
  resetForm: () => void;
}

const OrderDialogManager: React.FC<OrderDialogManagerProps> = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  clients,
  formData,
  handleInputChange,
  handleSelectChange,
  addOrder,
  updateOrder,
  isPending,
  resetForm
}) => {
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

  // Reset form when dialogs are closed
  useEffect(() => {
    if (!isAddDialogOpen && !isEditDialogOpen) {
      resetForm();
    }
  }, [isAddDialogOpen, isEditDialogOpen, resetForm]);

  return (
    <>
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
    </>
  );
};

export default OrderDialogManager;
