
import React from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordVisibilityToggleProps {
  showPassword: boolean;
  toggleShowPassword: () => void;
}

const PasswordVisibilityToggle: React.FC<PasswordVisibilityToggleProps> = ({ 
  showPassword, 
  toggleShowPassword 
}) => {
  return (
    <button
      type="button"
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
      onClick={toggleShowPassword}
      tabIndex={-1}
    >
      {showPassword ? (
        <EyeOff className="h-4 w-4" />
      ) : (
        <Eye className="h-4 w-4" />
      )}
    </button>
  );
};

export default PasswordVisibilityToggle;
