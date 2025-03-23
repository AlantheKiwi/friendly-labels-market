
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useAuthService } from "@/hooks/useAuthService";

interface AdminLoginFormProps {
  onLoginSuccess: () => void;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const authService = useAuthService();
  
  // Get these values directly from the service for consistency
  const DEFAULT_ADMIN_PASSWORD = authService.DEFAULT_ADMIN_PASSWORD;
  const ADMIN_EMAIL = authService.ADMIN_EMAIL;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Normalize email to lowercase for consistency
      const normalizedEmail = email.toLowerCase().trim();
      
      // Check if this is the admin email
      const isAdminEmail = normalizedEmail === ADMIN_EMAIL.toLowerCase().trim();
      
      if (isAdminEmail) {
        console.log("Admin login attempt detected");
        
        // First try with entered password
        const { data, error } = await authService.signInWithPassword(
          ADMIN_EMAIL, // Always use the exact admin email
          password
        );
        
        if (!error) {
          // Direct login successful
          console.log("Admin login successful with entered password");
          await authService.checkUserRoles(data.user.id);
          toast({
            title: "Login successful",
            description: "Welcome to the admin dashboard",
          });
          onLoginSuccess();
          setIsLoading(false);
          return;
        }
        
        console.log("Login with entered password failed:", error.message);
        
        // If the password is already the default but still failed, try to create admin
        if (password === DEFAULT_ADMIN_PASSWORD) {
          console.log("Already using default password, trying admin setup");
          setIsCreatingAdmin(true);
          
          const { data: adminData, error: setupError } = await authService.createAdminIfNotExists();
          
          setIsCreatingAdmin(false);
          
          if (setupError) {
            console.error("Admin setup failed:", setupError);
            setErrorMessage(setupError.message);
            toast({
              title: "Admin setup failed",
              description: setupError.message,
              variant: "destructive",
            });
            setIsLoading(false);
            return;
          }
          
          if (adminData) {
            // Admin was created or we got logged in
            console.log("Admin setup successful");
            await authService.checkUserRoles(adminData.user.id);
            toast({
              title: "Login successful",
              description: "Welcome to the admin dashboard. Please update your password.",
            });
            localStorage.setItem("requirePasswordChange", "true");
            onLoginSuccess();
            setIsLoading(false);
            return;
          }
        } else {
          // Try with default password
          console.log("Trying with default admin password:", DEFAULT_ADMIN_PASSWORD);
          
          const { data: defaultData, error: defaultError } = await authService.signInWithPassword(
            ADMIN_EMAIL,
            DEFAULT_ADMIN_PASSWORD
          );
          
          if (!defaultError) {
            // Login with default password successful
            console.log("Admin login successful with default password");
            await authService.checkUserRoles(defaultData.user.id);
            toast({
              title: "Login successful",
              description: "Welcome to the admin dashboard. Please change your default password.",
            });
            localStorage.setItem("requirePasswordChange", "true");
            onLoginSuccess();
            setIsLoading(false);
            return;
          }
          
          console.log("Login with default password failed:", defaultError.message);
        }
        
        // If we're here, all normal login attempts failed, so try creating the admin
        console.log("All login attempts failed, trying admin setup");
        setIsCreatingAdmin(true);
        
        const { data: adminData, error: setupError } = await authService.createAdminIfNotExists();
        
        setIsCreatingAdmin(false);
        
        if (setupError) {
          console.error("Admin setup failed:", setupError);
          setErrorMessage(setupError.message);
          toast({
            title: "Admin setup failed",
            description: setupError.message,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        if (adminData) {
          // Admin was created or we got logged in
          console.log("Admin setup successful");
          await authService.checkUserRoles(adminData.user.id);
          toast({
            title: "Login successful",
            description: "Welcome to the admin dashboard. Please update your password.",
          });
          localStorage.setItem("requirePasswordChange", "true");
          onLoginSuccess();
          setIsLoading(false);
          return;
        }
        
        // If we get here, all attempts failed
        setErrorMessage(`Could not log in. Please try again with the default password: ${DEFAULT_ADMIN_PASSWORD}`);
        toast({
          title: "Login failed",
          description: `Could not log in. Please try with the default password: ${DEFAULT_ADMIN_PASSWORD}`,
          variant: "destructive",
        });
      } else {
        // Not the admin email - reject
        setErrorMessage("You do not have administrator privileges");
        toast({
          title: "Access denied",
          description: "You do not have administrator privileges",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage("An unexpected error occurred during login");
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSetDefaultValues = () => {
    setEmail(ADMIN_EMAIL);
    setPassword(DEFAULT_ADMIN_PASSWORD);
  };

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
        </div>
      </div>
      {errorMessage && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )}
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
      
      <div className="pt-2">
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          className="w-full text-xs"
          onClick={handleSetDefaultValues}
        >
          Fill with default admin credentials
        </Button>
      </div>
      
      <div>
        <p className="text-xs text-amber-600 mt-2">
          Default admin email: {ADMIN_EMAIL}
        </p>
        <p className="text-xs text-amber-600">
          Default admin password: {DEFAULT_ADMIN_PASSWORD}
        </p>
        <p className="text-xs text-gray-500">
          If you're having trouble logging in, try these default credentials.
        </p>
      </div>
    </form>
  );
};

export default AdminLoginForm;
