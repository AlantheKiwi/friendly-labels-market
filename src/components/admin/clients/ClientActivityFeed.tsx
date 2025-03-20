
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Package2, CheckCircle, AlertCircle } from "lucide-react";

interface ClientActivityFeedProps {
  clientId: string;
}

interface ActivityItem {
  id: string;
  type: "order" | "query";
  date: string;
  title: string;
  description: string;
  status: string;
}

const ClientActivityFeed: React.FC<ClientActivityFeedProps> = ({ clientId }) => {
  // Fetch client's orders
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["clientOrdersActivity", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!clientId
  });

  // Fetch client's queries
  const { data: queries, isLoading: queriesLoading } = useQuery({
    queryKey: ["clientQueriesActivity", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("queries")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!clientId
  });

  // Combine and format activity items
  const getActivityItems = (): ActivityItem[] => {
    const activityItems: ActivityItem[] = [];
    
    if (orders) {
      orders.forEach(order => {
        activityItems.push({
          id: `order-${order.id}`,
          type: "order",
          date: order.created_at,
          title: `Order #${order.order_number} placed`,
          description: `${order.product_name} - $${parseFloat(order.price.toString()).toFixed(2)}`,
          status: order.status
        });
      });
    }
    
    if (queries) {
      queries.forEach(query => {
        activityItems.push({
          id: `query-${query.id}`,
          type: "query",
          date: query.created_at,
          title: `Support query: ${query.subject}`,
          description: query.message.length > 100 ? `${query.message.substring(0, 100)}...` : query.message,
          status: query.status
        });
      });
    }
    
    // Sort by date descending
    return activityItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const isLoading = ordersLoading || queriesLoading;
  const activityItems = getActivityItems();

  const getStatusIcon = (type: string, status: string) => {
    if (type === "order") {
      if (status === "completed") return <CheckCircle className="h-5 w-5 text-green-500" />;
      if (status === "processing") return <Package2 className="h-5 w-5 text-blue-500" />;
      return <Package2 className="h-5 w-5 text-yellow-500" />;
    } else {
      if (status === "resolved") return <CheckCircle className="h-5 w-5 text-green-500" />;
      if (status === "in progress") return <MessageSquare className="h-5 w-5 text-blue-500" />;
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <div className="h-6 w-6 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (activityItems.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">No activity found for this client.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activityItems.map((item) => (
        <div key={item.id} className="flex items-start space-x-4 border-b border-gray-100 pb-4">
          <div className="flex-shrink-0 mt-1">
            {getStatusIcon(item.type, item.status)}
          </div>
          <div className="flex-1">
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
            <p className="text-xs text-gray-400 mt-2">{new Date(item.date).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientActivityFeed;
