
import { useState } from "react";
import { OrderFormData, OrderFilters } from "@/types/order.types";

export const useOrderForm = () => {
  const [formData, setFormData] = useState<OrderFormData>({
    id: "",
    client_id: "",
    order_number: "",
    product_name: "",
    quantity: "",
    price: "",
    status: "pending"
  });
  
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [filters, setFilters] = useState<OrderFilters>({
    status: "all",
    dateFrom: null,
    dateTo: null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      id: "",
      client_id: "",
      order_number: "",
      product_name: "",
      quantity: "",
      price: "",
      status: "pending"
    });
    setIsEditMode(false);
  };

  const editOrder = (order: any) => {
    setFormData({
      id: order.id,
      client_id: order.client_id,
      order_number: order.order_number,
      product_name: order.product_name,
      quantity: order.quantity.toString(),
      price: order.price.toString(),
      status: order.status
    });
    setIsEditMode(true);
  };

  const handleFilterChange = (filterName: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  return {
    formData,
    isEditMode,
    filters,
    handleInputChange,
    handleSelectChange,
    handleFilterChange,
    editOrder,
    resetForm,
    setIsEditMode
  };
};
