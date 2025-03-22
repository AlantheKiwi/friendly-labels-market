
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search } from "lucide-react";

const TicketsSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: tickets, isLoading } = useQuery({
    queryKey: ["dashboardTickets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("queries")
        .select(`
          *,
          client:profiles(id, first_name, last_name, company)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Filter tickets based on search term
  const filteredTickets = tickets?.filter(ticket => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      ticket.subject.toLowerCase().includes(searchLower) ||
      ticket.message.toLowerCase().includes(searchLower) ||
      `${ticket.client.first_name} ${ticket.client.last_name}`.toLowerCase().includes(searchLower) ||
      (ticket.client.company && ticket.client.company.toLowerCase().includes(searchLower))
    );
  });

  // Function to get badge variant based on status
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return <Badge className="bg-blue-500">Open</Badge>;
      case "in progress":
        return <Badge className="bg-yellow-500">In Progress</Badge>;
      case "resolved":
        return <Badge className="bg-green-500">Resolved</Badge>;
      case "closed":
        return <Badge>Closed</Badge>;
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
          placeholder="Search support tickets..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Support Tickets</CardTitle>
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
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date Created</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets?.length ? (
                  filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.id.substring(0, 8)}</TableCell>
                      <TableCell>
                        {ticket.client.first_name} {ticket.client.last_name}
                        {ticket.client.company && (
                          <div className="text-xs text-gray-500">{ticket.client.company}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        {ticket.subject}
                        <div className="text-xs text-gray-500 truncate max-w-xs">
                          {ticket.message.substring(0, 50)}{ticket.message.length > 50 ? "..." : ""}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(ticket.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      {searchTerm ? "No tickets found matching your search" : "No support tickets found"}
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

export default TicketsSection;
