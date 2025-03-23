
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminLoginCard from "@/components/admin/auth/AdminLoginCard";
import AdminPasswordResetButton from "@/components/admin/auth/AdminPasswordResetButton";

const AdminLoginPage = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate("/admin/dashboard");
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
