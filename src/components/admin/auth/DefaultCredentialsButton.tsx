
import React from "react";
import { Button } from "@/components/ui/button";

interface DefaultCredentialsButtonProps {
  onClick: () => void;
}

const DefaultCredentialsButton: React.FC<DefaultCredentialsButtonProps> = ({ onClick }) => {
  return (
    <div className="pt-2">
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        className="w-full text-xs"
        onClick={onClick}
      >
        Fill with default admin credentials
      </Button>
    </div>
  );
};

export default DefaultCredentialsButton;
