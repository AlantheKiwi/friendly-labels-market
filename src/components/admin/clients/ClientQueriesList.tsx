
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface ClientQueriesListProps {
  clientId: string;
}

const ClientQueriesList: React.FC<ClientQueriesListProps> = ({ clientId }) => {
  const { data: queries, isLoading } = useQuery({
    queryKey: ["clientQueries", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("queries")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!clientId
  });

  // Function to get badge variant based on status
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "resolved":
        return <Badge className="bg-green-500">Resolved</Badge>;
      case "in progress":
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case "open":
        return <Badge className="bg-yellow-500">Open</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <div className="h-6 w-6 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!queries || queries.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">No queries found for this client.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Subject</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Resolved</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {queries.map((query) => (
          <TableRow key={query.id}>
            <TableCell className="font-medium">{query.subject}</TableCell>
            <TableCell>{new Date(query.created_at).toLocaleDateString()}</TableCell>
            <TableCell>{getStatusBadge(query.status)}</TableCell>
            <TableCell>
              {query.resolved_at ? new Date(query.resolved_at).toLocaleDateString() : 'Not resolved'}
            </TableCell>
            <TableCell>
              <Button variant="outline" size="sm" onClick={() => console.log("View query:", query.id)}>
                <Eye className="h-4 w-4 mr-1" /> View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ClientQueriesList;
