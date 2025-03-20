
import React from "react";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  company: string;
  phone: string;
  created_at: string;
}

interface ClientsTableProps {
  clients: Client[];
}

const ClientsTable: React.FC<ClientsTableProps> = ({ clients }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.length > 0 ? (
            clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.first_name} {client.last_name}</TableCell>
                <TableCell>{client.company || 'N/A'}</TableCell>
                <TableCell>{client.phone || 'N/A'}</TableCell>
                <TableCell>{new Date(client.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/clients/${client.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                No clients found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientsTable;
