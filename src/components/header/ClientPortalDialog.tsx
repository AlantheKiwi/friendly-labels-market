
import React, { useState } from "react";
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
import { LayoutDashboard, LogIn, UserPlus, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ClientPortalDialogProps {
  children: React.ReactNode;
}

const ClientPortalDialog: React.FC<ClientPortalDialogProps> = ({ children }) => {
  const { user, isClient, isAdmin, refreshRoles } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Determine if the user should have access (either client or admin)
  const hasAccess = isClient || isAdmin;

  const handleClientAccess = async () => {
    if (!user) {
      return; // Dialog will handle this with login/register options
    }

    // If user is logged in but doesn't have access, try to refresh roles
    if (!hasAccess) {
      setIsRefreshing(true);
      toast({
        title: "Checking permissions",
        description: "Verifying your access to the client portal...",
      });
      
      try {
        const roles = await refreshRoles();
        
        if (roles.isClient || roles.isAdmin) {
          toast({
            title: "Access granted",
            description: "You now have access to the client portal.",
          });
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
      } finally {
        setIsRefreshing(false);
      }
      return;
    }

    // If user is already verified as having access, just navigate
    navigate("/client/dashboard");
  };
  
  // Function to manually force role assignment and check
  const handleForceRoleCheck = async () => {
    if (!user) return;
    
    setIsRefreshing(true);
    toast({
      title: "Assigning client role",
      description: "Attempting to assign and verify client role...",
    });
    
    try {
      // This will force a complete role refresh and attempt to assign client role if missing
      const roles = await refreshRoles();
      
      if (roles.isClient || roles.isAdmin) {
        toast({
          title: "Success!",
          description: "Client role assigned successfully.",
        });
      } else {
        // Try one more explicit attempt to assign the role
        const { data: result } = await supabase.rpc('assign_client_role', {
          user_id: user.id
        });
        
        // Check roles again after the explicit assignment
        const updatedRoles = await refreshRoles();
        
        if (updatedRoles.isClient || updatedRoles.isAdmin) {
          toast({
            title: "Success!",
            description: "Client role assigned successfully after retry.",
          });
        } else {
          toast({
            title: "Role assignment failed",
            description: "Could not assign client role. Please contact support.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error("Error assigning client role:", error);
      toast({
        title: "Error",
        description: "There was a problem assigning the client role.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
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
              disabled={isRefreshing}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              {hasAccess ? "Access Client Portal" : "Check Portal Access"}
            </Button>
            
            {!hasAccess && (
              <Button 
                className="w-full" 
                onClick={handleForceRoleCheck}
                variant="outline"
                disabled={isRefreshing}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                Attempt Role Assignment
              </Button>
            )}
            
            <div className="text-sm text-gray-500 text-center">
              {hasAccess 
                ? "Click the button above to access your client portal."
                : "If you're a registered client but don't have access, try the 'Attempt Role Assignment' button or contact support."}
            </div>
            
            <div className="text-xs text-gray-400 border-t border-gray-200 pt-4 mt-2">
              Debug info: User ID: {user.id.substring(0, 8)}... | 
              isClient: {isClient ? "Yes" : "No"} | 
              isAdmin: {isAdmin ? "Yes" : "No"}
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
