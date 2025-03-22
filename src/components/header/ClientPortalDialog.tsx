
import React from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface ClientPortalDialogProps {
  children: React.ReactNode;
}

const ClientPortalDialog: React.FC<ClientPortalDialogProps> = ({ children }) => {
  const { user, isClient, refreshRoles } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleClientAccess = async () => {
    if (!user) {
      return; // Dialog will handle this with login/register options
    }

    // If user is logged in but doesn't have client role, try to refresh roles
    if (!isClient) {
      toast({
        title: "Checking permissions",
        description: "Verifying your access to the client portal...",
      });
      
      try {
        const roles = await refreshRoles();
        if (roles.isClient) {
          navigate("/client/dashboard");
        } else {
          toast({
            title: "Access denied",
            description: "You don't have client portal access. Please contact support.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error refreshing roles:", error);
        toast({
          title: "Error checking permissions",
          description: "There was a problem verifying your access. Please try again.",
          variant: "destructive"
        });
      }
      return;
    }

    // If user is already verified as client, just navigate
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
            Access your orders, invoices, and account information
          </DialogDescription>
        </DialogHeader>
        
        {user ? (
          // User is logged in, show access options
          <div className="flex flex-col space-y-4 py-4">
            <Button 
              className="w-full" 
              onClick={handleClientAccess}
              variant="default"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Access Client Portal
            </Button>
            <div className="text-sm text-gray-500 text-center">
              Click the button above to access your client portal. If you don't have access,
              please contact our support team.
            </div>
          </div>
        ) : (
          // User is not logged in, show login/register options
          <div className="flex flex-col space-y-4 py-4">
            <Link to="/auth/login">
              <Button className="w-full" variant="default">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In to Client Portal
              </Button>
            </Link>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>
            <Link to="/auth/register">
              <Button className="w-full" variant="outline">
                <UserPlus className="mr-2 h-4 w-4" />
                Register for Client Access
              </Button>
            </Link>
            <div className="text-sm text-gray-500 text-center">
              New clients can register for portal access. Registration requires approval.
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ClientPortalDialog;
