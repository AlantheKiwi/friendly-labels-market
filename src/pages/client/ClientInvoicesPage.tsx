
import React, { useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ClientLayout from "@/components/client/ClientLayout";
import { useClientInvoices } from "@/hooks/useClientInvoices";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ClientInvoicesPage = () => {
  const { invoices, isLoading, error } = useClientInvoices();
  
  // Memoize the status badge rendering function
  const getStatusBadge = useMemo(() => {
    return (status: string) => {
      switch (status.toLowerCase()) {
        case "paid":
          return <Badge className="bg-green-500">Paid</Badge>;
        case "pending":
          return <Badge className="bg-yellow-500">Pending</Badge>;
        case "overdue":
          return <Badge className="bg-red-500">Overdue</Badge>;
        default:
          return <Badge>{status}</Badge>;
      }
    };
  }, []);

  // Memoize the download handler to prevent recreation on each render
  const handleDownload = useCallback((invoiceId: string) => {
    console.log(`Download invoice: ${invoiceId}`);
    alert("Download functionality will be implemented soon");
  }, []);

  return (
    <ClientLayout>
      <h1 className="text-3xl font-bold mb-6">My Invoices</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              Error loading invoices. Please try again later.
            </div>
          ) : invoices && invoices.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Order #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Amount (NZD)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id.substring(0, 8).toUpperCase()}</TableCell>
                    <TableCell>{invoice.order_number}</TableCell>
                    <TableCell>{new Date(invoice.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{invoice.product_name}</TableCell>
                    <TableCell>${(invoice.price * invoice.quantity).toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell>
                      <Button 
                        variant="link" 
                        className="text-primary hover:underline p-0 h-auto"
                        onClick={() => handleDownload(invoice.id)}
                      >
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No invoices found. Your order history will appear here.
            </div>
          )}
        </CardContent>
      </Card>
    </ClientLayout>
  );
};

export default ClientInvoicesPage;
