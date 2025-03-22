
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useMemo } from "react";

export interface Invoice {
  id: string;
  order_number: string;
  created_at: string;
  price: number;
  quantity: number;
  product_name: string;
  status: string;
}

export const useClientInvoices = () => {
  const { user } = useAuth();
  
  // Use useMemo to ensure this value is stable between renders
  const userId = useMemo(() => user?.id, [user?.id]);

  const { data: invoices, isLoading, error } = useQuery({
    queryKey: ["clientInvoices", userId],
    queryFn: async (): Promise<Invoice[]> => {
      if (!userId) {
        return [];
      }

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("client_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching invoices:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once to prevent infinite retry loops
  });

  return {
    invoices,
    isLoading,
    error,
  };
};
