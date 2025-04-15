import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Lock, Bug } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD } from "@/services/auth/constants";
import { createAdminIfNotExists, forceResetAdminPassword } from "@/services/auth/adminService";
import { supabase } from "@/integrations/supabase/client";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [adminSetupStatus, setAdminSetupStatus] = useState("");
  const redirectedRef = useRef(false);
  const { signIn, user, isClient, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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
      const result = await createAdminIfNotExists();
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
      const result = await forceResetAdminPassword();
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
  
  const createAdminWithDirect = async () => {
    setAdminSetupStatus("Creating admin with direct signup...");
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: DEFAULT_ADMIN_PASSWORD
      });
      
      if (!signInError) {
        setAdminSetupStatus("Admin already exists with the default password. You can now log in.");
        fillAdminCredentials();
        toast({
          title: "Success",
          description: "Admin already exists. You can now log in with the default credentials.",
          variant: "default"
        });
        return;
      }
      
      const { data, error } = await supabase.auth.signUp({
        email: ADMIN_EMAIL,
        password: DEFAULT_ADMIN_PASSWORD
      });
      
      if (error) {
        setAdminSetupStatus(`Direct signup failed: ${error.message}`);
        toast({
          title: "Setup Error",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      if (data.user) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: data.user.id,
            role: 'admin'
          });
          
        if (roleError) {
          setAdminSetupStatus(`User created but role assignment failed: ${roleError.message}`);
          toast({
            title: "Partial Success",
            description: `Admin user created but role assignment failed. Please try again.`,
            variant: "destructive"
          });
          return;
        }
        
        setAdminSetupStatus(`Admin created successfully with ID: ${data.user.id}`);
        toast({
          title: "Success",
          description: "Admin user created successfully. You can now log in.",
          variant: "default"
        });
        
        fillAdminCredentials();
      } else {
        setAdminSetupStatus("User signup completed but no user was returned");
        toast({
          title: "Warning",
          description: "Setup completed with unexpected result. Try logging in.",
          variant: "destructive"
        });
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12">
        <div className="w-full max-w-md px-4">
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg text-center shadow-sm">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">Welcome to Our Client Portal</h2>
            <p className="text-blue-600">
              Sign in to access your exclusive client dashboard
            </p>
          </div>
          
          <Card className="border-2 border-gray-200 shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Login</CardTitle>
              <CardDescription>
                Sign in to your account
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
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button 
                  onClick={toggleDebug}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                  type="button"
                >
                  <Bug className="h-3 w-3 mr-1" />
                  {showDebug ? "Hide Debug Info" : "Show Debug Info"}
                </button>
                
                {showDebug && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-md text-xs">
                    <div>
                      <p className="font-semibold mb-1">Admin credentials:</p>
                      <p>Email: {ADMIN_EMAIL}</p>
                      <p>Password: {DEFAULT_ADMIN_PASSWORD}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Button 
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                          onClick={fillAdminCredentials}
                        >
                          Fill Admin Credentials
                        </Button>
                        <Button 
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                          onClick={setupAdminUser}
                        >
                          Create Admin
                        </Button>
                        <Button 
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                          onClick={resetAdmin}
                        >
                          Reset Admin
                        </Button>
                        <Button 
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 bg-blue-50 hover:bg-blue-100 text-blue-700"
                          onClick={createAdminWithDirect}
                        >
                          Direct Admin Setup
                        </Button>
                      </div>
                      {adminSetupStatus && (
                        <div className="mt-2 p-2 bg-blue-50 rounded">
                          <p className="text-xs">{adminSetupStatus}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <div className="text-center text-sm">
                <span className="text-gray-500">Don't have an account? </span>
                <Link to="/auth/register" className="text-blue-600 hover:underline">
                  Register
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
