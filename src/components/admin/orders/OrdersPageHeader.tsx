
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface OrdersPageHeaderProps {
  onAddOrder: () => void;
}

const OrdersPageHeader: React.FC<OrdersPageHeaderProps> = ({ onAddOrder }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Order Management</h1>
      <Button onClick={onAddOrder}>
        <Plus className="mr-2 h-4 w-4" /> Add New Order
      </Button>
    </div>
  );
};

export default OrdersPageHeader;
