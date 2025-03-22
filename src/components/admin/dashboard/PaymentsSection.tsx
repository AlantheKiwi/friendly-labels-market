
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

// Mock payment data - would be replaced with real API calls
const mockPayments = [
  { id: "pay-001", client: "John Smith", clientId: "client1", company: "XYZ Corp", method: "Credit Card", amount: 245.50, status: "successful", date: "2023-09-15" },
  { id: "pay-002", client: "Sarah Johnson", clientId: "client2", company: null, method: "PayPal", amount: 189.99, status: "successful", date: "2023-09-14" },
  { id: "pay-003", client: "Michael Brown", clientId: "client3", company: "Brown Industries", method: "Bank Transfer", amount: 520.00, status: "pending", date: "2023-09-12" },
  { id: "pay-004", client: "Emily Davis", clientId: "client4", company: null, method: "Credit Card", amount: 75.25, status: "failed", date: "2023-09-10" },
  { id: "pay-005", client: "Kevin Wilson", clientId: "client5", company: "Wilson Logistics", method: "Credit Card", amount: 350.00, status: "successful", date: "2023-09-08" },
];

const PaymentsSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [payments] = useState(mockPayments);
  
  // Filter payments based on search term
  const filteredPayments = payments.filter(payment => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      payment.id.toLowerCase().includes(searchLower) ||
      payment.client.toLowerCase().includes(searchLower) ||
      (payment.company && payment.company.toLowerCase().includes(searchLower)) ||
      payment.method.toLowerCase().includes(searchLower) ||
      payment.status.toLowerCase().includes(searchLower)
    );
  });

  // Function to get badge variant based on status
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "successful":
        return <Badge className="bg-green-500">Successful</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div>
      <div className="mb-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="search"
          placeholder="Search payments..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount (NZD)</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length ? (
                filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>
                      {payment.client}
                      {payment.company && (
                        <div className="text-xs text-gray-500">{payment.company}</div>
                      )}
                    </TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                    <TableCell>${payment.amount.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    {searchTerm ? "No payments found matching your search" : "No payments found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsSection;
