
import React from "react";
import { Link } from "react-router-dom";
import { LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface UserActionsProps {
  isOnClientDashboard?: boolean;
  isOnAdminDashboard?: boolean;
}

const UserActions: React.FC<UserActionsProps> = ({ 
  isOnClientDashboard, 
  isOnAdminDashboard 
}) => {
  const { user, signOut, isClient, isAdmin } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    console.log("UserActions - Logout button clicked");
    try {
      // Use a toast to indicate logout is in progress
      toast({
        title: "Signing out...",
        description: "Please wait while we log you out",
      });
      
      // Clear any supabase auth related items in localStorage first
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('supabase.auth.')) {
          localStorage.removeItem(key);
          console.log(`UserActions - Cleared localStorage item: ${key}`);
        }
      });
      
      // Call the signOut function
      await signOut();
      console.log("UserActions - signOut function completed");
      
      // Force reload to clear any cached state
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Sign out failed",
        description: "There was an error signing out. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Show client portal button for any logged in user who is a client
  if (user && isClient) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="default" className="flex items-center gap-2" size="sm" asChild>
          <Link to="/client/dashboard">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Client Portal</span>
          </Link>
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2" 
          onClick={handleSignOut} 
          size="sm"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    );
  } 
  // Show admin panel button for any logged in user who is an admin
  else if (user && isAdmin) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="default" className="flex items-center gap-2" size="sm" asChild>
          <Link to="/admin/dashboard">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Admin Panel</span>
          </Link>
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2" 
          onClick={handleSignOut} 
          size="sm"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    );
  } 
  // Show only logout button for any other logged in user
  else if (user) {
    return (
      <Button 
        variant="outline" 
        className="flex items-center gap-2" 
        onClick={handleSignOut} 
        size="sm"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Logout</span>
      </Button>
    );
  } 
  // Show login button for non-logged in users
  else {
    return (
      <Button variant="default" className="flex items-center gap-2" size="sm" asChild>
        <Link to="/auth/login">
          <LogIn className="h-4 w-4" />
          <span className="hidden sm:inline">Client Login</span>
        </Link>
      </Button>
    );
  }
};

export default UserActions;
