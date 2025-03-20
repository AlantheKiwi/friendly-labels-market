
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface OrdersTableProps {
  orders: any[];
  getStatusBadge: (status: string) => React.ReactNode;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, getStatusBadge }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order #</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Price (NZD)</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders?.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.order_number}</TableCell>
            <TableCell>
              {order.client.first_name} {order.client.last_name}
              {order.client.company && <div className="text-xs text-gray-500">{order.client.company}</div>}
            </TableCell>
            <TableCell>{order.product_name}</TableCell>
            <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
            <TableCell>{order.quantity}</TableCell>
            <TableCell>${parseFloat(order.price.toString()).toFixed(2)}</TableCell>
            <TableCell>{getStatusBadge(order.status)}</TableCell>
            <TableCell>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {orders?.length === 0 && (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-4 text-gray-500">
              No orders found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default OrdersTable;
