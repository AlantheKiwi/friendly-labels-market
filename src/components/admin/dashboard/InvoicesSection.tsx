
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search } from "lucide-react";

const InvoicesSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: invoices, isLoading } = useQuery({
    queryKey: ["dashboardInvoices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          client:profiles(id, first_name, last_name, company)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Filter invoices based on search term
  const filteredInvoices = invoices?.filter(invoice => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      invoice.order_number.toLowerCase().includes(searchLower) ||
      invoice.product_name.toLowerCase().includes(searchLower) ||
      `${invoice.client.first_name} ${invoice.client.last_name}`.toLowerCase().includes(searchLower) ||
      (invoice.client.company && invoice.client.company.toLowerCase().includes(searchLower))
    );
  });

  // Function to get badge variant based on status
  const getStatusBadge = (status: string) => {
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

  // Helper function to map order status to invoice status
  const mapStatusToInvoiceStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "paid";
      case "processing":
      case "pending":
        return "pending";
      default:
        return status;
    }
  };

  // Utility function to add days to a date
  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  return (
    <div>
      <div className="mb-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="search"
          placeholder="Search invoices..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount (NZD)</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices?.length ? (
                  filteredInvoices.map((invoice) => {
                    const createdDate = new Date(invoice.created_at);
                    const dueDate = addDays(createdDate, 30); // Set due date as 30 days after creation
                    const invoiceStatus = mapStatusToInvoiceStatus(invoice.status);

                    return (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">INV-{invoice.order_number}</TableCell>
                        <TableCell>
                          {invoice.client.first_name} {invoice.client.last_name}
                          {invoice.client.company && (
                            <div className="text-xs text-gray-500">{invoice.client.company}</div>
                          )}
                        </TableCell>
                        <TableCell>{createdDate.toLocaleDateString()}</TableCell>
                        <TableCell>{dueDate.toLocaleDateString()}</TableCell>
                        <TableCell>${(invoice.price * invoice.quantity).toFixed(2)}</TableCell>
                        <TableCell>{getStatusBadge(invoiceStatus)}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      {searchTerm ? "No invoices found matching your search" : "No invoices found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoicesSection;
