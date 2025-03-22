
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";

const LoginView: React.FC = () => {
  return (
    <div className="flex flex-col space-y-4 py-4">
      <div className="text-center py-4">
        <p>Client authentication has been removed.</p>
        <p className="text-sm text-gray-500 mt-2">A new authentication system will be implemented soon.</p>
      </div>
    </div>
  );
};

export default LoginView;
