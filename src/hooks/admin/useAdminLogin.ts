
import { useState } from "react";
import { useAuthService } from "@/hooks/useAuthService";
import { useAdminLoginUI } from "./useAdminLoginUI";
import { useAdminLoginAuth } from "./useAdminLoginAuth";

export const useAdminLogin = (onLoginSuccess: () => void) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  
  const authService = useAuthService();
  
  // Get default credentials
  const DEFAULT_ADMIN_PASSWORD = authService.DEFAULT_ADMIN_PASSWORD;
  const ADMIN_EMAIL = authService.ADMIN_EMAIL;
  
  // UI state and handlers
  const { 
    showPassword, 
    toggleShowPassword,
    handleSetDefaultValues,
  } = useAdminLoginUI({ 
    setEmail, 
    setPassword, 
    ADMIN_EMAIL, 
    DEFAULT_ADMIN_PASSWORD 
  });
  
  // Auth operations
  const { 
    handleLogin, 
    handleForgotPassword,
    handleResetAdminPassword
  } = useAdminLoginAuth({
    email,
    password,
    ADMIN_EMAIL,
    DEFAULT_ADMIN_PASSWORD,
    setIsLoading,
    setIsCreatingAdmin,
    setErrorMessage,
    authService,
    onLoginSuccess
  });

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    isLoading,
    isCreatingAdmin,
    errorMessage,
    DEFAULT_ADMIN_PASSWORD,
    ADMIN_EMAIL,
    handleLogin,
    toggleShowPassword,
    handleSetDefaultValues,
    handleForgotPassword,
    handleResetAdminPassword
  };
};
