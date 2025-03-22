
import React from "react";
import ClientPortalDialog from "./ClientPortalDialog";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";

interface UserActionsProps {
  isOnClientDashboard?: boolean;
  isOnAdminDashboard?: boolean;
}

const UserActions: React.FC<UserActionsProps> = () => {
  return (
    <ClientPortalDialog>
      <Button variant="default" className="flex items-center gap-2" size="sm">
        <LayoutDashboard className="h-4 w-4" />
        <span className="hidden sm:inline">Client Portal</span>
      </Button>
    </ClientPortalDialog>
  );
};

export default UserActions;
