
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { OrderFormData } from "@/types/order.types";

export const useOrderMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addOrderMutation = useMutation({
    mutationFn: async (orderData: OrderFormData) => {
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
    mutationFn: async (orderData: OrderFormData) => {
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

  return {
    addOrder: addOrderMutation.mutate,
    updateOrder: updateOrderMutation.mutate,
    isPending: addOrderMutation.isPending || updateOrderMutation.isPending
  };
};
