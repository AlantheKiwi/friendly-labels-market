
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ClientsGrid from "@/components/admin/clients/ClientsGrid";
import ClientsTable from "@/components/admin/clients/ClientsTable";
import ClientSearchBar from "@/components/admin/clients/ClientSearchBar";
import AddClientDialog from "@/components/admin/clients/AddClientDialog";

const AdminClientsPage = () => {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const { data: clients, isLoading: clientsLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, user_roles!inner(*)")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!isAdmin
  });

  const filteredClients = clients?.filter(client => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      (client.first_name && client.first_name.toLowerCase().includes(searchLower)) ||
      (client.last_name && client.last_name.toLowerCase().includes(searchLower)) ||
      (client.company && client.company.toLowerCase().includes(searchLower))
    );
  });

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "Please log in to access the admin dashboard",
        variant: "destructive",
      });
      navigate("/admin/login");
    }
  }, [isAdmin, authLoading, navigate, toast]);

  if (authLoading || clientsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />
      <main className="flex-grow bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Client Management</h1>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add New Client
            </Button>
          </div>
          
          <ClientSearchBar 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
          
          {viewMode === "grid" ? (
            <ClientsGrid clients={filteredClients || []} />
          ) : (
            <ClientsTable clients={filteredClients || []} />
          )}
        </div>
      </main>

      <AddClientDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
};

export default AdminClientsPage;
