
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Save, Users, Package2, MessageSquare } from "lucide-react";
import ClientOrdersList from "@/components/admin/clients/ClientOrdersList";
import ClientQueriesList from "@/components/admin/clients/ClientQueriesList";
import ClientActivityFeed from "@/components/admin/clients/ClientActivityFeed";

const ClientDetailPage = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { isAdmin, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [clientData, setClientData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    phone: "",
    notes: ""
  });

  // Fetch client details
  const { data: client, isLoading } = useQuery({
    queryKey: ["client", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", clientId)
        .single();
      
      if (error) throw error;
      
      // Populate form data
      setClientData({
        firstName: data.first_name || "",
        lastName: data.last_name || "",
        company: data.company || "",
        phone: data.phone || "",
        notes: data.notes || ""
      });
      
      return data;
    },
    enabled: !!clientId && !!isAdmin
  });

  // Update client mutation
  const updateClientMutation = useMutation({
    mutationFn: async (updatedData: typeof clientData) => {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          first_name: updatedData.firstName,
          last_name: updatedData.lastName,
          company: updatedData.company,
          phone: updatedData.phone,
          notes: updatedData.notes
        })
        .eq("id", clientId)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["client", clientId]
      });
      toast({
        title: "Success",
        description: "Client information updated successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update client: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setClientData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateClientMutation.mutate(clientData);
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />
      <main className="flex-grow bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mr-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <h1 className="text-3xl font-bold">Client Details</h1>
          </div>
          
          {client && (
            <>
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {client.first_name} {client.last_name}
                    </h2>
                    {client.company && (
                      <p className="text-gray-500">{client.company}</p>
                    )}
                  </div>
                  <Badge variant="outline" className="text-sm">
                    Client since {new Date(client.created_at).toLocaleDateString()}
                  </Badge>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={clientData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={clientData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={clientData.company}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={clientData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Input
                      id="notes"
                      value={clientData.notes}
                      onChange={handleInputChange}
                      className="min-h-[80px]"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={updateClientMutation.isPending}
                    >
                      {updateClientMutation.isPending ? (
                        <>
                          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" /> Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
              
              <Tabs defaultValue="orders" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="orders" className="flex items-center">
                    <Package2 className="mr-2 h-4 w-4" /> Orders
                  </TabsTrigger>
                  <TabsTrigger value="queries" className="flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4" /> Queries
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="flex items-center">
                    <Users className="mr-2 h-4 w-4" /> Activity
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="orders">
                  <Card>
                    <CardHeader>
                      <CardTitle>Order History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ClientOrdersList clientId={clientId!} />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="queries">
                  <Card>
                    <CardHeader>
                      <CardTitle>Support Queries</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ClientQueriesList clientId={clientId!} />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="activity">
                  <Card>
                    <CardHeader>
                      <CardTitle>Activity Feed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ClientActivityFeed clientId={clientId!} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ClientDetailPage;
