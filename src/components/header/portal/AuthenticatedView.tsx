
import React from "react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";

const AuthenticatedView: React.FC = () => {
  return (
    <div className="flex flex-col space-y-4 py-4">
      <div className="text-center py-4">
        <p>Client authentication has been removed.</p>
        <p className="text-sm text-gray-500 mt-2">A new authentication system will be implemented soon.</p>
      </div>
    </div>
  );
};

export default AuthenticatedView;
