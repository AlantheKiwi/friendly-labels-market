
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import ClientLayout from "@/components/client/ClientLayout";

const ClientInvoicesPage = () => {
  const { user } = useAuth();
  
  // Mock data for invoices since we don't have an invoices table yet
  const mockInvoices = [
    {
      id: "INV-001",
      order_number: "ORD-001",
      date: "2024-05-15",
      amount: 250.00,
      status: "paid"
    },
    {
      id: "INV-002",
      order_number: "ORD-002",
      date: "2024-05-10",
      amount: 175.50,
      status: "pending"
    },
    {
      id: "INV-003",
      order_number: "ORD-003",
      date: "2024-05-05",
      amount: 320.25,
      status: "paid"
    }
  ];

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

  return (
    <ClientLayout>
      <h1 className="text-3xl font-bold mb-6">My Invoices</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Order #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount (NZD)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.order_number}</TableCell>
                  <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                  <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell>
                    <a 
                      href="#" 
                      className="text-primary hover:underline"
                      onClick={(e) => {
                        e.preventDefault();
                        alert("Download functionality will be implemented soon");
                      }}
                    >
                      Download
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </ClientLayout>
  );
};

export default ClientInvoicesPage;
