
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";

const LoginView: React.FC = () => {
  return (
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
        New clients can register for portal access. Client role is assigned automatically.
      </div>
    </div>
  );
};

export default LoginView;
