
import React from "react";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface ForgotPasswordButtonProps {
  onClick: () => void;
}

const ForgotPasswordButton: React.FC<ForgotPasswordButtonProps> = ({ onClick }) => {
  return (
    <Button 
      type="button" 
      variant="ghost" 
      size="sm" 
      className="w-full text-xs mt-2 text-gray-500 hover:text-gray-700"
      onClick={onClick}
    >
      <Mail className="mr-1 h-3 w-3" />
      Forgot password?
    </Button>
  );
};

export default ForgotPasswordButton;
