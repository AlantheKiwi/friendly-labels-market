
import React from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminHeader from "@/components/admin/AdminHeader";
import ClientOrdersList from "@/components/admin/clients/ClientOrdersList";
import ClientQueriesList from "@/components/admin/clients/ClientQueriesList";

const ClientDetailPage = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const { toast } = useToast();

  const { data: clientData, isLoading } = useQuery({
    queryKey: ["client", clientId],
    queryFn: async () => {
      if (!clientId) throw new Error("Client ID is required");
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", clientId)
        .single();
      
      if (error) {
        toast({
          title: "Error",
          description: `Failed to load client: ${error.message}`,
          variant: "destructive"
        });
        throw error;
      }
      
      return data;
    },
    enabled: !!clientId
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Client not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />
      <main className="flex-grow bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Client Details</h1>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Contact Information</h3>
                  <p><span className="font-medium">Name:</span> {clientData.first_name} {clientData.last_name}</p>
                  <p><span className="font-medium">Email:</span> {clientData.email || 'N/A'}</p>
                  <p><span className="font-medium">Phone:</span> {clientData.phone || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Business Information</h3>
                  <p><span className="font-medium">Company:</span> {clientData.company || 'N/A'}</p>
                  <p><span className="font-medium">Client Since:</span> {new Date(clientData.created_at).toLocaleDateString()}</p>
                  <p><span className="font-medium">Last Updated:</span> {new Date(clientData.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="orders" className="mb-6">
            <TabsList>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="queries">Queries</TabsTrigger>
            </TabsList>
            <TabsContent value="orders" className="mt-6">
              <ClientOrdersList clientId={clientId || ""} />
            </TabsContent>
            <TabsContent value="queries" className="mt-6">
              <ClientQueriesList clientId={clientId || ""} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ClientDetailPage;
