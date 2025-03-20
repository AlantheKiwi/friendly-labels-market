
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ClientsGridProps {
  clients: any[];
}

const ClientsGrid: React.FC<ClientsGridProps> = ({ clients }) => {
  if (!clients || clients.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">No clients found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {clients.map((client) => (
        <Card key={client.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">
                    {client.first_name} {client.last_name}
                  </h3>
                  {client.company && (
                    <p className="text-sm text-gray-500">{client.company}</p>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/admin/clients/${client.id}`}>
                        <Eye className="mr-2 h-4 w-4" /> View Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={`/admin/clients/${client.id}`}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Details
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="mt-2 space-y-1">
                {client.phone && (
                  <p className="text-sm">
                    <span className="text-gray-500">Phone:</span> {client.phone}
                  </p>
                )}
                <p className="text-sm">
                  <span className="text-gray-500">Since:</span> {new Date(client.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 flex justify-between items-center">
              <div className="flex space-x-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Client
                </Badge>
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link to={`/admin/clients/${client.id}`}>
                  <Eye className="mr-2 h-4 w-4" /> View
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ClientsGrid;
