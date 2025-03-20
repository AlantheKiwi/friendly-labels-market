
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

// Sample order data for demonstration
const DEMO_ORDERS = [
  { id: "ORD-1001", client: "Auckland Printing Co", date: "2023-08-15", items: 5, total: 850.00, status: "Completed" },
  { id: "ORD-1002", client: "Wellington Labels Ltd", date: "2023-08-18", items: 3, total: 425.50, status: "Processing" },
  { id: "ORD-1003", client: "Christchurch Packaging", date: "2023-08-20", items: 8, total: 1275.00, status: "Pending" },
];

const AdminOrdersPage = () => {
  const { isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    if (!loading && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "Please log in to access the admin dashboard",
        variant: "destructive",
      });
      navigate("/admin/login");
    }
  }, [isAdmin, loading, navigate, toast]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-brand-blue border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect via useEffect
  }

  // Function to get badge variant based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "Processing":
        return <Badge className="bg-blue-500">Processing</Badge>;
      case "Pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />
      <main className="flex-grow bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Order Management</h1>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total (NZD)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {DEMO_ORDERS.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.client}</TableCell>
                      <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminOrdersPage;
