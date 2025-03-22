
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
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Import views
import LoginView from "./portal/LoginView";
import AuthenticatedView from "./portal/AuthenticatedView";

interface ClientPortalDialogProps {
  children: React.ReactNode;
}

const ClientPortalDialog: React.FC<ClientPortalDialogProps> = ({ children }) => {
  const { user, isClient } = useAuth();
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate("/client/dashboard");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Client Portal Access</DialogTitle>
          <DialogDescription>
            {user 
              ? "Manage your orders, invoices, and account information" 
              : "Sign in to access your orders, invoices, and account information"}
          </DialogDescription>
        </DialogHeader>
        
        {user ? (
          <div className="space-y-4">
            <AuthenticatedView />
            <Button 
              className="w-full" 
              variant="default"
              onClick={handleGoToDashboard}
            >
              Go to Dashboard
            </Button>
          </div>
        ) : (
          <LoginView />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ClientPortalDialog;
