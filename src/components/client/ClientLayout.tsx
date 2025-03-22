
import React, { useEffect } from "react";
import ClientSidebar from "./ClientSidebar";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const { user, isClient, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // No need to redirect here as ProtectedRoute will handle that
  // This component should only receive the children when user is authenticated
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <ClientSidebar />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;
