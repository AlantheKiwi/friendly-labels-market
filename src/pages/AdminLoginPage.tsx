
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminLoginCard from "@/components/admin/auth/AdminLoginCard";
import AdminPasswordResetButton from "@/components/admin/auth/AdminPasswordResetButton";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_EMAIL } from "@/services/auth/constants";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // This avoids relying on the auth context
  const checkAdminStatus = async () => {
    try {
      // Get current session directly from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return false;
      }
      
      const userEmail = session.user?.email?.toLowerCase();
      
      // Direct admin check by email
      if (userEmail === ADMIN_EMAIL.toLowerCase()) {
        console.log("Admin email match found, proceeding to dashboard");
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard.",
        });
        navigate("/admin/dashboard");
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  };

  const handleLoginSuccess = async () => {
    await checkAdminStatus();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12">
        <div className="w-full max-w-md px-4">
          <AdminLoginCard onLoginSuccess={handleLoginSuccess} />
          <AdminPasswordResetButton className="mt-6" />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLoginPage;
