
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ClientLayout from "@/components/client/ClientLayout";

const ClientQueriesPage = () => {
  const { user } = useAuth();

  const { data: queries, isLoading } = useQuery({
    queryKey: ["clientQueries", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("queries")
        .select("*")
        .eq("client_id", user?.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user
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
      <ClientLayout>
        <div className="flex items-center justify-center h-full">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Queries</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Query
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Query History</CardTitle>
        </CardHeader>
        <CardContent>
          {queries && queries.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queries.map((query) => (
                  <TableRow key={query.id}>
                    <TableCell className="font-medium">{query.subject}</TableCell>
                    <TableCell>{new Date(query.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(query.status)}</TableCell>
                    <TableCell>{new Date(query.updated_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <a 
                        href="#" 
                        className="text-primary hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          alert("View details functionality will be implemented soon");
                        }}
                      >
                        View Details
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">You haven't submitted any queries yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </ClientLayout>
  );
};

export default ClientQueriesPage;
