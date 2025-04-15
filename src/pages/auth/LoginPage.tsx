
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Lock, Bug, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD } from "@/services/auth/constants";
import { useAuthService } from "@/hooks/useAuthService";
import { supabase } from "@/integrations/supabase/client";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDebug, setShowDebug] = useState(true); // Set to true by default for easier access
  const [adminSetupStatus, setAdminSetupStatus] = useState("");
  const redirectedRef = useRef(false);
  const { signIn, user, isClient, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const authService = useAuthService();

  useEffect(() => {
    if (user && !redirectedRef.current && !isLoading) {
      console.log("User logged in, redirecting based on role:", { isAdmin, isClient });
      redirectedRef.current = true;
      
      if (isAdmin) {
        navigate("/admin/dashboard", { replace: true });
      } else if (isClient) {
        navigate("/client/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [user, isAdmin, isClient, navigate, isLoading]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    console.log("Attempting login with:", email);
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      // Toast will be shown in the signIn function
      // Navigation is handled in the useEffect above
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleDebug = () => {
    setShowDebug(!showDebug);
  };

  const fillAdminCredentials = () => {
    setEmail(ADMIN_EMAIL);
    setPassword(DEFAULT_ADMIN_PASSWORD);
  };

  const setupAdminUser = async () => {
    setAdminSetupStatus("Setting up admin user...");
    try {
      const result = await authService.createAdminIfNotExists();
      setAdminSetupStatus(result.message);
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });
      
      if (result.success) {
        fillAdminCredentials();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setAdminSetupStatus(`Error: ${message}`);
      toast({
        title: "Setup Error",
        description: message,
        variant: "destructive"
      });
    }
  };

  const resetAdmin = async () => {
    setAdminSetupStatus("Resetting admin password...");
    try {
      const result = await authService.forceResetAdminPassword();
      setAdminSetupStatus(result.message);
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setAdminSetupStatus(`Error: ${message}`);
      toast({
        title: "Reset Error",
        description: message,
        variant: "destructive"
      });
    }
  };
  
  const fixAdminLogin = async () => {
    setAdminSetupStatus("Ensuring admin login works...");
    setIsLoading(true);
    try {
      const result = await authService.ensureAdminCanLogin();
      
      setAdminSetupStatus(result.message);
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });
      
      if (result.success) {
        fillAdminCredentials();
        
        // Try immediate login if we were successful
        if (result.success) {
          try {
            console.log("Attempting direct login with admin credentials after fix");
            await signIn(ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD);
            console.log("Successful auto-login");
            return; // The redirect will happen in the useEffect
          } catch (loginError) {
            console.error("Auto-login error:", loginError);
            // Continue to show the form if auto-login fails
          }
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setAdminSetupStatus(`Error: ${message}`);
      toast({
        title: "Setup Error",
        description: message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // New function to specifically make alan@insight an admin
  const makeAlanAdmin = async () => {
    setAdminSetupStatus("Setting up admin account for alan@insight-ai-systems.com...");
    setIsLoading(true);
    try {
      // First ensure the user exists
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: ADMIN_EMAIL,
        password: DEFAULT_ADMIN_PASSWORD
      });
      
      if (signUpError && !signUpError.message.includes("already registered")) {
        throw new Error(`Failed to create user: ${signUpError.message}`);
      }
      
      // Now directly insert admin role
      const userId = signUpData?.user?.id;
      if (userId) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role: 'admin'
          });
          
        if (roleError && !roleError.message.includes("unique constraint")) {
          throw new Error(`Failed to assign admin role: ${roleError.message}`);
        }
      }
      
      // If we get here, try to sign in directly
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: DEFAULT_ADMIN_PASSWORD
      });
      
      if (signInError) {
        throw new Error(`Failed to sign in: ${signInError.message}`);
      }
      
      setAdminSetupStatus("Admin setup successful! You are now logged in as admin.");
      toast({
        title: "Success",
        description: "Admin account set up and logged in successfully",
      });
      
      // Fill the form with admin credentials
      fillAdminCredentials();
      
      // Redirect will happen via the auth state listener
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setAdminSetupStatus(`Error: ${message}`);
      toast({
        title: "Setup Error",
        description: message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12">
        <div className="w-full max-w-md px-4">
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg text-center shadow-sm">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">Admin Login</h2>
            <p className="text-blue-600">
              Sign in to access the admin dashboard
            </p>
          </div>
          
          <Card className="border-2 border-gray-200 shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Login</CardTitle>
              <CardDescription>
                Sign in to your account
              </CardDescription>
              
              {/* Quick access buttons for admin */}
              <div className="mt-2 flex justify-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => {
                    fillAdminCredentials();
                    toast({
                      title: "Admin credentials filled",
                      description: "You can now click Sign In to log in as admin",
                    });
                  }}
                >
                  Admin Login
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-green-50 hover:bg-green-100 text-green-700"
                  onClick={makeAlanAdmin}
                  disabled={isLoading}
                >
                  {isLoading ? "Working..." : "Make Alan Admin & Login"}
                </Button>
              </div>
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
                    placeholder="name@example.com"
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
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Lock className="mr-2 h-4 w-4" /> Sign in
                    </span>
                  )}
                </Button>
              </form>
              
              {adminSetupStatus && (
                <div className="mt-4 p-2 bg-blue-50 rounded">
                  <p className="text-sm">{adminSetupStatus}</p>
                </div>
              )}
              
              {/* Admin helpers */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h3 className="text-sm font-medium mb-2">Admin tools:</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs h-9"
                    onClick={fixAdminLogin}
                    disabled={isLoading}
                  >
                    Fix Admin Login
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs h-9"
                    onClick={setupAdminUser}
                    disabled={isLoading}
                  >
                    Create Admin
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs h-9"
                    onClick={fillAdminCredentials}
                    disabled={isLoading}
                  >
                    Fill Admin Credentials
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs h-9"
                    onClick={resetAdmin}
                    disabled={isLoading}
                  >
                    Reset Admin Password
                  </Button>
                </div>
              </div>
              
              {/* Credential info */}
              <div className="mt-4 p-3 bg-gray-50 rounded-md text-xs">
                <div>
                  <p className="font-semibold mb-1">Admin credentials:</p>
                  <p>Email: {ADMIN_EMAIL}</p>
                  <p>Password: {DEFAULT_ADMIN_PASSWORD}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
