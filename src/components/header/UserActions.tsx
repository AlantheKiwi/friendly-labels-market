
import React from "react";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserActionsProps {
  isOnClientDashboard?: boolean;
  isOnAdminDashboard?: boolean;
}

const UserActions: React.FC<UserActionsProps> = () => {
  return (
    <Button variant="default" className="flex items-center gap-2" size="sm" asChild>
      <Link to="/">
        <LogIn className="h-4 w-4" />
        <span className="hidden sm:inline">Client Portal</span>
      </Link>
    </Button>
  );
};

export default UserActions;
