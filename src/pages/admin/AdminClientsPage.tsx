
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

// Sample client data for demonstration
const DEMO_CLIENTS = [
  { id: 1, name: "Auckland Printing Co", email: "contact@aucklandprinting.co.nz", phone: "09 123 4567", orders: 12 },
  { id: 2, name: "Wellington Labels Ltd", email: "info@wellingtonlabels.co.nz", phone: "04 987 6543", orders: 8 },
  { id: 3, name: "Christchurch Packaging", email: "sales@chcpackaging.co.nz", phone: "03 456 7890", orders: 5 },
];

const AdminClientsPage = () => {
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

  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />
      <main className="flex-grow bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Client Management</h1>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add New Client
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Client Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Total Orders</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {DEMO_CLIENTS.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>{client.id}</TableCell>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.phone}</TableCell>
                      <TableCell>{client.orders}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="mr-2">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          View
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

export default AdminClientsPage;
