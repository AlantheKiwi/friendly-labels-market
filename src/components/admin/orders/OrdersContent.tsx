
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OrdersTable from "./OrdersTable";
import OrderSearch from "./OrderSearch";
import OrderFilters from "./OrderFilters";
import { OrderFilters as OrderFiltersType } from "@/types/order.types";
import OrderStatusBadge from "./OrderStatusBadge";

interface OrdersContentProps {
  orders: any[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: OrderFiltersType;
  handleFilterChange: (filterName: string, value: any) => void;
  onEditOrder: (order: any) => void;
}

const OrdersContent: React.FC<OrdersContentProps> = ({
  orders,
  searchTerm,
  setSearchTerm,
  filters,
  handleFilterChange,
  onEditOrder
}) => {
  // Filter orders based on search term
  const filteredOrders = orders?.filter(order => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      order.order_number.toLowerCase().includes(searchLower) ||
      order.product_name.toLowerCase().includes(searchLower) ||
      (order.client.company && order.client.company.toLowerCase().includes(searchLower)) ||
      `${order.client.first_name} ${order.client.last_name}`.toLowerCase().includes(searchLower)
    );
  });

  const getStatusBadge = (status: string) => {
    return <OrderStatusBadge status={status} />;
  };

  return (
    <>
      <OrderFilters 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />
      
      <div className="mb-6">
        <OrderSearch 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <OrdersTable 
            orders={filteredOrders || []} 
            getStatusBadge={getStatusBadge} 
            onEditOrder={onEditOrder}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default OrdersContent;
