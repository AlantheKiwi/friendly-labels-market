
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useOrders = (isAdmin: boolean) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    id: "",
    client_id: "",
    order_number: "",
    product_name: "",
    quantity: "",
    price: "",
    status: "pending"
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    dateFrom: null as Date | null,
    dateTo: null as Date | null
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      let query = supabase
        .from("orders")
        .select(`
          *,
          client:profiles(id, first_name, last_name, company)
        `);
      
      // Apply status filter if not "all"
      if (filters.status !== "all") {
        query = query.eq("status", filters.status);
      }
      
      // Apply date range filters if set
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        query = query.gte("created_at", fromDate.toISOString());
      }
      
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        query = query.lte("created_at", toDate.toISOString());
      }
      
      query = query.order("created_at", { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!isAdmin
  });

  const { data: clients, isLoading: clientsLoading } = useQuery({
    queryKey: ["clientsList"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, company");
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!isAdmin
  });

  const addOrderMutation = useMutation({
    mutationFn: async (orderData: typeof formData) => {
      const { data, error } = await supabase
        .from("orders")
        .insert([{
          client_id: orderData.client_id,
          order_number: orderData.order_number,
          product_name: orderData.product_name,
          quantity: parseInt(orderData.quantity),
          price: parseFloat(orderData.price),
          status: orderData.status
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      resetForm();
      toast({
        title: "Success",
        description: "Order added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add order: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const updateOrderMutation = useMutation({
    mutationFn: async (orderData: typeof formData) => {
      const { data, error } = await supabase
        .from("orders")
        .update({
          client_id: orderData.client_id,
          order_number: orderData.order_number,
          product_name: orderData.product_name,
          quantity: parseInt(orderData.quantity),
          price: parseFloat(orderData.price),
          status: orderData.status
        })
        .eq('id', orderData.id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      resetForm();
      setIsEditMode(false);
      toast({
        title: "Success",
        description: "Order updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update order: ${error.message}`,
        variant: "destructive"
      });
    }
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
    orders,
    clients,
    formData,
    isEditMode,
    filters,
    isLoading: ordersLoading || clientsLoading,
    isPending: addOrderMutation.isPending || updateOrderMutation.isPending,
    handleInputChange,
    handleSelectChange,
    handleFilterChange,
    addOrder: addOrderMutation.mutate,
    updateOrder: updateOrderMutation.mutate,
    editOrder,
    resetForm,
    setIsEditMode
  };
};
