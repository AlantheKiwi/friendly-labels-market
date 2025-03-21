
import { useOrderQueries } from "./orders/useOrderQueries";
import { useOrderMutations } from "./orders/useOrderMutations";
import { useOrderForm } from "./orders/useOrderForm";

export const useOrders = (isAdmin: boolean) => {
  const { formData, isEditMode, filters, handleInputChange, handleSelectChange, handleFilterChange, editOrder, resetForm, setIsEditMode } = useOrderForm();
  const { orders, clients, isLoading } = useOrderQueries(isAdmin, filters);
  const { addOrder, updateOrder, isPending } = useOrderMutations();

  return {
    // Data
    orders,
    clients,
    formData,
    isEditMode,
    filters,
    
    // Loading states
    isLoading,
    isPending,
    
    // Form handlers
    handleInputChange,
    handleSelectChange,
    handleFilterChange,
    
    // CRUD operations
    addOrder,
    updateOrder,
    editOrder,
    resetForm,
    setIsEditMode
  };
};
