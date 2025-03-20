
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useOrders = (isAdmin: boolean) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    client_id: "",
    order_number: "",
    product_name: "",
    quantity: "",
    price: "",
    status: "pending"
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          client:profiles(id, first_name, last_name, company)
        `)
        .order("created_at", { ascending: false });
      
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
      client_id: "",
      order_number: "",
      product_name: "",
      quantity: "",
      price: "",
      status: "pending"
    });
  };

  return {
    orders,
    clients,
    formData,
    isLoading: ordersLoading || clientsLoading,
    isPending: addOrderMutation.isPending,
    handleInputChange,
    handleSelectChange,
    addOrder: addOrderMutation.mutate,
    resetForm
  };
};
