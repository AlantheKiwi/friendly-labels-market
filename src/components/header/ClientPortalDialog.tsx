
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Import the simplified view component
import LoginView from "./portal/LoginView";

interface ClientPortalDialogProps {
  children: React.ReactNode;
}

const ClientPortalDialog: React.FC<ClientPortalDialogProps> = ({ children }) => {
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
        
        {/* Show simple view indicating auth has been removed */}
        <LoginView />
      </DialogContent>
    </Dialog>
  );
};

export default ClientPortalDialog;
