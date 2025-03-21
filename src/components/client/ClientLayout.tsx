
import React from "react";
import ClientSidebar from "./ClientSidebar";
import { useAuth } from "@/context/AuthContext";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }
  
  if (!user) {
    return null; // This will be handled by the ProtectedRoute component
  }
  
  return (
    <div className="flex h-screen">
      <ClientSidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default ClientLayout;
