
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

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

  const { data: invoices, isLoading, error } = useQuery({
    queryKey: ["clientInvoices", user?.id],
    queryFn: async (): Promise<Invoice[]> => {
      if (!user?.id) {
        return [];
      }

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching invoices:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user?.id,
  });

  return {
    invoices,
    isLoading,
    error,
  };
};
