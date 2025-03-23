import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useToast } from "@/components/ui/use-toast";

const AdminDashboardPage: React.FC = () => {
  const { isAdmin, isLoading, adminEmail } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      toast({
        title: "Access denied",
        description: "You do not have admin privileges.",
        variant: "destructive"
      });
      navigate("/", { replace: true });
    }
  }, [isAdmin, isLoading, navigate, toast]);

  return <div>Admin Dashboard Page</div>;
};

export default AdminDashboardPage;
