import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminHeader from "@/components/admin/AdminHeader";
import ClientOrdersList from "@/components/admin/clients/ClientOrdersList";
import ClientQueriesList from "@/components/admin/clients/ClientQueriesList";
import { Pencil, Save } from "lucide-react";

const ClientDetailPage = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState("");

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
      
      setNotes(data.notes || "");
      return data;
    },
    enabled: !!clientId
  });

  const updateNotesMutation = useMutation({
    mutationFn: async (newNotes: string) => {
      if (!clientId) throw new Error("Client ID is required");
      
      const { data, error } = await supabase
        .from("profiles")
        .update({ notes: newNotes })
        .eq("id", clientId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client", clientId] });
      toast({
        title: "Notes updated",
        description: "Client notes have been updated successfully",
      });
      setIsEditingNotes(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to update notes",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleSaveNotes = () => {
    updateNotesMutation.mutate(notes);
  };

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
          
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Client Notes</CardTitle>
              {!isEditingNotes ? (
                <Button variant="outline" size="icon" onClick={() => setIsEditingNotes(true)}>
                  <Pencil className="h-4 w-4" />
                </Button>
              ) : (
                <Button variant="outline" size="icon" onClick={handleSaveNotes} disabled={updateNotesMutation.isPending}>
                  {updateNotesMutation.isPending ? (
                    <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {isEditingNotes ? (
                <Textarea 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)} 
                  placeholder="Add notes about this client..."
                  className="min-h-[150px]"
                />
              ) : (
                <div className="prose max-w-none">
                  {clientData.notes ? (
                    <p className="whitespace-pre-wrap">{clientData.notes}</p>
                  ) : (
                    <p className="text-gray-500 italic">No notes available for this client.</p>
                  )}
                </div>
              )}
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
