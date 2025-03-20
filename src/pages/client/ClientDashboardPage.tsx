
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Package2, MessageSquare } from "lucide-react";

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
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Client Dashboard</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Welcome, {profile?.first_name} {profile?.last_name}</h2>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Link to="/client/orders">
              <Card className="hover:shadow-lg transition-shadow">
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
            
            <Link to="/client/queries">
              <Card className="hover:shadow-lg transition-shadow">
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
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/products" className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center">
                <p className="font-medium">Browse Products</p>
              </Link>
              <Link to="/custom-quote" className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center">
                <p className="font-medium">Request Quote</p>
              </Link>
              <Link to="/client/queries" className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center">
                <p className="font-medium">Submit Query</p>
              </Link>
              <Link to="/contact" className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center">
                <p className="font-medium">Contact Us</p>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClientDashboardPage;
