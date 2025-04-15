
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User, Settings } from "lucide-react";

interface UserActionsProps {
  isOnClientDashboard?: boolean;
  isOnAdminDashboard?: boolean;
}

const UserActions: React.FC<UserActionsProps> = () => {
  const { user, signOut, isAdmin } = useAuth();

  // If user is logged in, show user menu and logout button
  if (user) {
    return (
      <div className="flex items-center gap-2">
        {isAdmin ? (
          <Button variant="outline" className="flex items-center gap-2 border-blue-500 text-blue-600" size="sm" asChild>
            <Link to="/admin/dashboard">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </Button>
        ) : (
          <Button variant="outline" className="flex items-center gap-2" size="sm" asChild>
            <Link to="/client/dashboard">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">My Account</span>
            </Link>
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          className="text-gray-500 hover:text-gray-700" 
          size="sm"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">Logout</span>
        </Button>
      </div>
    );
  }

  // If no user, show login button
  return (
    <Button variant="default" className="flex items-center gap-2" size="sm" asChild>
      <Link to="/auth/login">
        <LogIn className="h-4 w-4" />
        <span className="hidden sm:inline">Sign In</span>
      </Link>
    </Button>
  );
};

export default UserActions;
