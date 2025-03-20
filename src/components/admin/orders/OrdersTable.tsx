
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Eye } from "lucide-react";

interface OrdersTableProps {
  orders: any[];
  getStatusBadge: (status: string) => React.ReactNode;
  onEditOrder: (order: any) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, getStatusBadge, onEditOrder }) => {
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
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => onEditOrder(order)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
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
