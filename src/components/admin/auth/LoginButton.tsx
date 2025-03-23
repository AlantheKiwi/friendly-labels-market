
import React from "react";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

interface LoginButtonProps {
  isLoading: boolean;
  isCreatingAdmin: boolean;
}

const LoginButton: React.FC<LoginButtonProps> = ({ isLoading, isCreatingAdmin }) => {
  return (
    <Button
      type="submit"
      className="w-full"
      disabled={isLoading || isCreatingAdmin}
    >
      {isLoading || isCreatingAdmin ? (
        <span className="flex items-center justify-center">
          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
          {isCreatingAdmin ? "Setting up admin..." : "Signing in..."}
        </span>
      ) : (
        <span className="flex items-center justify-center">
          <Lock className="mr-2 h-4 w-4" /> Sign in
        </span>
      )}
    </Button>
  );
};

export default LoginButton;
