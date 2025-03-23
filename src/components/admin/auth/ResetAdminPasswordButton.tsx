
import React from "react";
import { Button } from "@/components/ui/button";
import { KeyRound } from "lucide-react";

interface ResetAdminPasswordButtonProps {
  onClick: () => void;
}

const ResetAdminPasswordButton: React.FC<ResetAdminPasswordButtonProps> = ({ onClick }) => {
  return (
    <Button 
      type="button" 
      variant="ghost" 
      size="sm" 
      className="w-full text-xs mt-2 text-red-500 hover:text-red-700"
      onClick={onClick}
    >
      <KeyRound className="mr-1 h-3 w-3" />
      Reset Admin Password
    </Button>
  );
};

export default ResetAdminPasswordButton;
