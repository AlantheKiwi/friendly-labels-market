
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import AdminLoginCard from "@/components/admin/auth/AdminLoginCard";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    // If user is already logged in and is admin, redirect to admin dashboard
    if (user && isAdmin) {
      navigate("/admin/dashboard");
    }
  }, [user, isAdmin, navigate]);

  const handleLoginSuccess = () => {
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12">
        <div className="w-full max-w-md px-4">
          <AdminLoginCard onLoginSuccess={handleLoginSuccess} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLoginPage;
