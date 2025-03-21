
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Order, Client, OrderFilters } from "@/types/order.types";

export const useOrderQueries = (isAdmin: boolean, filters: OrderFilters) => {
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders", filters],
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
      return data as Order[] || [];
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
      return data as Client[] || [];
    },
    enabled: !!isAdmin
  });

  return {
    orders,
    clients,
    isLoading: ordersLoading || clientsLoading
  };
};
