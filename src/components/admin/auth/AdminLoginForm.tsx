
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminLogin } from "@/hooks/admin";
import PasswordVisibilityToggle from "./PasswordVisibilityToggle";
import LoginErrorMessage from "./LoginErrorMessage";
import AdminCredentialHints from "./AdminCredentialHints";
import LoginButton from "./LoginButton";
import DefaultCredentialsButton from "./DefaultCredentialsButton";
import ForgotPasswordButton from "./ForgotPasswordButton";
import ResetAdminPasswordButton from "./ResetAdminPasswordButton";
import AdminLoginDebugHelper from "./AdminLoginDebugHelper";

interface AdminLoginFormProps {
  onLoginSuccess: () => void;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onLoginSuccess }) => {
  const [showDebugTools, setShowDebugTools] = useState(false);
  
  const {
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
  } = useAdminLogin(onLoginSuccess);

  // Function to toggle debug tools with keyboard shortcut
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.shiftKey && e.key === 'D') {
      setShowDebugTools(prev => !prev);
      console.log("Debug mode toggled:", !showDebugTools);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4" onKeyDown={handleKeyDown}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@example.com"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <PasswordVisibilityToggle 
            showPassword={showPassword} 
            toggleShowPassword={toggleShowPassword} 
          />
        </div>
      </div>
      
      <LoginErrorMessage message={errorMessage} />
      
      <LoginButton 
        isLoading={isLoading} 
        isCreatingAdmin={isCreatingAdmin} 
      />
      
      <div className="flex flex-col space-y-1">
        <DefaultCredentialsButton onClick={handleSetDefaultValues} />
        <ForgotPasswordButton onClick={handleForgotPassword} />
        <ResetAdminPasswordButton onClick={handleResetAdminPassword} />
      </div>
      
      <AdminCredentialHints 
        adminEmail={ADMIN_EMAIL} 
        defaultPassword={DEFAULT_ADMIN_PASSWORD} 
      />
      
      {showDebugTools && (
        <AdminLoginDebugHelper 
          adminEmail={ADMIN_EMAIL}
          defaultPassword={DEFAULT_ADMIN_PASSWORD}
        />
      )}
      
      {/* Hidden hint for debug mode */}
      <p className="text-xs text-gray-400 text-center mt-4">
        Press Shift+D to toggle admin debug tools
      </p>
    </form>
  );
};

export default AdminLoginForm;
