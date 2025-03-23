
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Lock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useAuthService } from "@/hooks/useAuthService";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  const authService = useAuthService();

  useEffect(() => {
    // If user is already logged in and is admin, redirect to admin dashboard
    if (user && isAdmin) {
      navigate("/admin/dashboard");
    }
  }, [user, isAdmin, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Normalize email to lowercase for consistency
      const normalizedEmail = email.toLowerCase();
      
      // Check if this is the admin email
      const isAdminEmail = normalizedEmail === "alan@insight-ai-systems.com";
      
      if (isAdminEmail) {
        console.log("Admin login attempt detected");
        
        // Try to sign in directly first - this will work if account exists with correct password
        const { data, error } = await authService.signInWithPassword(normalizedEmail, password);
        
        if (!error) {
          // Direct login successful
          console.log("Admin login successful");
          await authService.checkUserRoles(data.user.id);
          toast({
            title: "Login successful",
            description: "Welcome to the admin dashboard",
          });
          navigate("/admin/dashboard");
          setIsLoading(false);
          return;
        }
        
        // If login failed, try our special admin setup function
        console.log("Direct login failed, trying admin setup");
        setIsCreatingAdmin(true);
        
        // This will attempt to create the admin if it doesn't exist,
        // or return appropriate error messages if it does
        const { error: adminSetupError } = await authService.createAdminIfNotExists(normalizedEmail, "letmein1983!!");
        setIsCreatingAdmin(false);
        
        if (adminSetupError) {
          console.error("Admin setup error:", adminSetupError);
          setErrorMessage(adminSetupError.message);
          toast({
            title: "Admin login issue",
            description: adminSetupError.message,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        // If we get here, we successfully created the admin account or confirmed it exists
        // Try to log in with default password
        console.log("Attempting login with default admin password");
        const { data: loginData, error: loginError } = await authService.signInWithPassword(
          normalizedEmail, 
          "letmein1983!!"
        );

        if (loginError) {
          console.error("Login with default password failed:", loginError);
          setErrorMessage("Login failed. Please try with the password you set or the default 'letmein1983!!'");
          toast({
            title: "Login failed",
            description: "Please try with the password you set or the default 'letmein1983!!'",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        // Login successful
        await authService.checkUserRoles(loginData.user.id);
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
        });
        
        // Set flag for password change if using default
        localStorage.setItem("requirePasswordChange", "true");
        navigate("/admin/dashboard");
      } else {
        // Not the admin email - reject
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12">
        <div className="w-full max-w-md px-4">
          <Card className="border-2 border-gray-200 shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
              <CardDescription>
                Sign in to access the admin dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                {email.toLowerCase() === "alan@insight-ai-systems.com" && (
                  <div>
                    <p className="text-xs text-amber-600 mt-2">
                      Default admin password: letmein1983!!
                    </p>
                    <p className="text-xs text-gray-500">
                      If you're having trouble logging in, try this default password.
                    </p>
                  </div>
                )}
              </form>
            </CardContent>
            <CardFooter className="text-center text-sm text-gray-500">
              <p className="w-full">
                This is a secure area. Unauthorized access is prohibited.
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLoginPage;
