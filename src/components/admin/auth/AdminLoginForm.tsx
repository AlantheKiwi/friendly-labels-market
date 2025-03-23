
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminLogin } from "@/hooks/useAdminLogin";
import PasswordVisibilityToggle from "./PasswordVisibilityToggle";
import LoginErrorMessage from "./LoginErrorMessage";
import AdminCredentialHints from "./AdminCredentialHints";
import LoginButton from "./LoginButton";
import DefaultCredentialsButton from "./DefaultCredentialsButton";

interface AdminLoginFormProps {
  onLoginSuccess: () => void;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onLoginSuccess }) => {
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
    handleSetDefaultValues
  } = useAdminLogin(onLoginSuccess);

  return (
    <form onSubmit={handleLogin} className="space-y-4">
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
      
      <DefaultCredentialsButton onClick={handleSetDefaultValues} />
      
      <AdminCredentialHints 
        adminEmail={ADMIN_EMAIL} 
        defaultPassword={DEFAULT_ADMIN_PASSWORD} 
      />
    </form>
  );
};

export default AdminLoginForm;
