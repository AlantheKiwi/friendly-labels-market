
import { useState } from "react";

interface UseAdminLoginUIProps {
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  ADMIN_EMAIL: string;
  DEFAULT_ADMIN_PASSWORD: string;
}

export const useAdminLoginUI = ({
  setEmail,
  setPassword,
  ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD
}: UseAdminLoginUIProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSetDefaultValues = () => {
    setEmail(ADMIN_EMAIL);
    setPassword(DEFAULT_ADMIN_PASSWORD);
  };

  return {
    showPassword,
    toggleShowPassword,
    handleSetDefaultValues
  };
};
