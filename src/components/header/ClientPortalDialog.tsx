
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";

// Import the new component views
import LoginView from "./portal/LoginView";
import AuthenticatedView from "./portal/AuthenticatedView";

interface ClientPortalDialogProps {
  children: React.ReactNode;
}

const ClientPortalDialog: React.FC<ClientPortalDialogProps> = ({ children }) => {
  const { user, isClient, isAdmin, refreshRoles } = useAuth();
  
  // Determine if the user should have access (either client or admin)
  const hasAccess = isClient || isAdmin;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Client Portal Access</DialogTitle>
          <DialogDescription>
            Access your orders, invoices, and account information
          </DialogDescription>
        </DialogHeader>
        
        {user ? (
          // User is logged in, show authenticated view
          <AuthenticatedView 
            userId={user.id} 
            hasAccess={hasAccess} 
            refreshRoles={refreshRoles}
            isAdmin={isAdmin}
            isClient={isClient}
          />
        ) : (
          // User is not logged in, show login view
          <LoginView />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ClientPortalDialog;
