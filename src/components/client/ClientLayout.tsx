
import React, { memo } from "react";
import ClientSidebar from "./ClientSidebar";
import { useAuth } from "@/context/auth/AuthContext";
import Header from "@/components/Header";

interface ClientLayoutProps {
  children: React.ReactNode;
}

// Memoize the component to prevent unnecessary re-renders
const ClientLayout: React.FC<ClientLayoutProps> = memo(({ children }) => {
  const { isLoading } = useAuth();
  
  // Simple loading state that doesn't cause re-renders
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
});

// Add displayName for better debugging
ClientLayout.displayName = "ClientLayout";

export default ClientLayout;
