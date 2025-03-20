
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

// Sample quote data for demonstration
const DEMO_QUOTES = [
  { id: "QUO-1001", client: "Auckland Printing Co", date: "2023-08-10", validUntil: "2023-09-10", total: 1250.00, status: "Approved" },
  { id: "QUO-1002", client: "Wellington Labels Ltd", date: "2023-08-12", validUntil: "2023-09-12", total: 785.50, status: "Pending" },
  { id: "QUO-1003", client: "Christchurch Packaging", date: "2023-08-14", validUntil: "2023-09-14", total: 2175.00, status: "Expired" },
];

const AdminQuotesPage = () => {
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
      case "Approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "Pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "Expired":
        return <Badge className="bg-red-500">Expired</Badge>;
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
            <h1 className="text-3xl font-bold">Quote Management</h1>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create New Quote
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Quotes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quote ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead>Total (NZD)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {DEMO_QUOTES.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell className="font-medium">{quote.id}</TableCell>
                      <TableCell>{quote.client}</TableCell>
                      <TableCell>{new Date(quote.date).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(quote.validUntil).toLocaleDateString()}</TableCell>
                      <TableCell>${quote.total.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(quote.status)}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="mr-2">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          PDF
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

export default AdminQuotesPage;
