
import React from "react";
import { Badge } from "@/components/ui/badge";

interface OrderStatusBadgeProps {
  status: string;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  switch (status.toLowerCase()) {
    case "completed":
      return <Badge className="bg-green-500">Completed</Badge>;
    case "processing":
      return <Badge className="bg-blue-500">Processing</Badge>;
    case "pending":
      return <Badge className="bg-yellow-500">Pending</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export default OrderStatusBadge;
