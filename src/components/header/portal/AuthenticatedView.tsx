import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ensureClientRole } from "@/hooks/useRoleCheck";

interface AuthenticatedViewProps {
  userId: string;
  hasAccess: boolean;
  refreshRoles: () => Promise<{ isClient: boolean; isAdmin: boolean }>;
  isAdmin: boolean;
  isClient: boolean;
}

const AuthenticatedView: React.FC<AuthenticatedViewProps> = ({
  userId,
  hasAccess,
  refreshRoles,
  isAdmin,
  isClient
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleClientAccess = async () => {
    // If user has access, just navigate
    if (hasAccess) {
      navigate("/client/dashboard");
      return;
    }

    // Otherwise, try to refresh roles
    setIsRefreshing(true);
    toast({
      title: "Checking permissions",
      description: "Verifying your access to the client portal...",
    });
    
    try {
      // First, ensure client role is assigned
      await ensureClientRole(userId);
      
      // Then refresh roles to see the updated permissions
      const roles = await refreshRoles();
      
      if (roles.isClient || roles.isAdmin) {
        toast({
          title: "Access granted",
          description: "You now have access to the client portal.",
        });
        navigate("/client/dashboard");
      } else {
        toast({
          title: "Access assignment in progress",
          description: "Your client access is being set up. Please try again in a moment.",
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
  };
  
  const handleForceRoleCheck = async () => {
    setIsRefreshing(true);
    toast({
      title: "Assigning client role",
      description: "Attempting to assign and verify client role...",
    });
    
    try {
      // Direct database insert first (most reliable)
      const { error: insertError } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: "client" });
        
      if (insertError) {
        console.error("Direct insert failed:", insertError);
        
        // RPC fallback
        const { error: rpcError } = await supabase.rpc('assign_client_role', {
          user_id: userId
        });
        
        if (rpcError) {
          console.error("RPC failed:", rpcError);
        }
      }
      
      // Call ensureClientRole as a final fallback
      await ensureClientRole(userId);
      
      // Check roles again after the assignment attempts
      const updatedRoles = await refreshRoles();
      
      if (updatedRoles.isClient || updatedRoles.isAdmin) {
        toast({
          title: "Success!",
          description: "Client role assigned successfully. You can now access the client portal.",
        });
        
        // Automatically navigate to dashboard on success
        navigate("/client/dashboard");
      } else {
        toast({
          title: "Role assignment attempted",
          description: "Please try clicking 'Check Portal Access' again.",
        });
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
          Assign Client Role & Access Portal
        </Button>
      )}
      
      <div className="text-sm text-gray-500 text-center">
        {hasAccess 
          ? "Click the button above to access your client portal."
          : "If you should have client access, click the 'Assign Client Role' button."}
      </div>
      
      <div className="text-xs text-gray-400 border-t border-gray-200 pt-4 mt-2">
        Debug info: User ID: {userId.substring(0, 8)}... | 
        isClient: {isClient ? "Yes" : "No"} | 
        isAdmin: {isAdmin ? "Yes" : "No"}
      </div>
    </div>
  );
};

export default AuthenticatedView;
