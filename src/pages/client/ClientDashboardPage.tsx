
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Package2, MessageSquare, Receipt, Bell, FileText } from "lucide-react";
import ClientLayout from "@/components/client/ClientLayout";
import UserDebugInfo from "@/components/UserDebugInfo";

const ClientDashboardPage = () => {
  const { user } = useAuth();

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const { data: orderCount, isLoading: isLoadingOrders } = useQuery({
    queryKey: ["orderCount", user?.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("client_id", user?.id);
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user
  });

  const { data: queryCount, isLoading: isLoadingQueries } = useQuery({
    queryKey: ["queryCount", user?.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("queries")
        .select("*", { count: "exact", head: true })
        .eq("client_id", user?.id);
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user
  });

  const isLoading = isLoadingProfile || isLoadingOrders || isLoadingQueries;

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
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Welcome, {profile?.first_name} {profile?.last_name}</h2>
        <UserDebugInfo />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600"><span className="font-medium">Email:</span> {user?.email}</p>
            <p className="text-gray-600"><span className="font-medium">Company:</span> {profile?.company || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-600"><span className="font-medium">Phone:</span> {profile?.phone || 'N/A'}</p>
            <p className="text-gray-600"><span className="font-medium">Account Created:</span> {new Date(profile?.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link to="/client/orders">
          <Card className="h-full hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Orders</CardTitle>
                <CardDescription>View and track your orders</CardDescription>
              </div>
              <Package2 className="h-8 w-8 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{orderCount}</p>
              <p className="text-sm text-gray-500">Total Orders</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/client/invoices">
          <Card className="h-full hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Invoices</CardTitle>
                <CardDescription>View your invoices</CardDescription>
              </div>
              <Receipt className="h-8 w-8 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">--</p>
              <p className="text-sm text-gray-500">Total Invoices</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/client/offers">
          <Card className="h-full hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Offers</CardTitle>
                <CardDescription>Special offers for you</CardDescription>
              </div>
              <Bell className="h-8 w-8 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">--</p>
              <p className="text-sm text-gray-500">Available Offers</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/client/notes">
          <Card className="h-full hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Notes</CardTitle>
                <CardDescription>Your saved notes</CardDescription>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">--</p>
              <p className="text-sm text-gray-500">Notes</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/client/queries">
          <Card className="h-full hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Queries</CardTitle>
                <CardDescription>Submit and track your queries</CardDescription>
              </div>
              <MessageSquare className="h-8 w-8 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{queryCount}</p>
              <p className="text-sm text-gray-500">Total Queries</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </ClientLayout>
  );
};

export default ClientDashboardPage;
