
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AdminLoginDebugHelperProps {
  adminEmail: string;
  defaultPassword: string;
}

const AdminLoginDebugHelper: React.FC<AdminLoginDebugHelperProps> = ({
  adminEmail,
  defaultPassword
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const { toast } = useToast();

  // Function to check if admin exists and validate password format
  const checkAdminAccount = async () => {
    setIsChecking(true);
    setDebugInfo("");
    
    try {
      // Check for admin in auth.users table
      console.log("Checking admin account:", adminEmail);
      
      // Log password details without revealing full password
      const passwordDetails = {
        length: defaultPassword.length,
        firstChar: defaultPassword.charAt(0),
        lastChar: defaultPassword.charAt(defaultPassword.length - 1),
        containsSpecialChars: /[!@#$%^&*(),.?":{}|<>]/.test(defaultPassword),
        // Check for invisible characters or encoding issues
        hasInvisibleChars: defaultPassword !== defaultPassword.trim(),
        charCodes: Array.from(defaultPassword).map(c => c.charCodeAt(0))
      };
      
      console.log("Password details:", passwordDetails);
      
      // Try to get the user (will work even if not authenticated)
      const { data: userData, error: userError } = await supabase.auth.admin
        .getUserByEmail(adminEmail)
        .catch(err => {
          console.error("Error in getUserByEmail:", err);
          return { data: null, error: err };
        });
      
      if (userError) {
        setDebugInfo(`Error checking admin: ${userError.message}`);
        console.error("Admin check error:", userError);
        return;
      }
      
      if (!userData) {
        setDebugInfo("Admin account does not exist. Please create it.");
        return;
      }
      
      setDebugInfo(`
Admin account exists with ID: ${userData.id}
Email: ${userData.email}
Created at: ${new Date(userData.created_at).toLocaleString()}
Password details:
- Length: ${passwordDetails.length}
- Contains special chars: ${passwordDetails.containsSpecialChars}
- Has invisible characters: ${passwordDetails.hasInvisibleChars}
- Character codes: ${passwordDetails.charCodes.join(', ')}
      `);
      
    } catch (error: any) {
      console.error("Admin check unexpected error:", error);
      setDebugInfo(`Error: ${error.message}`);
    } finally {
      setIsChecking(false);
    }
  };

  // Function to force reset admin password through Supabase API
  const forceResetAdminPassword = async () => {
    setIsResetting(true);
    
    try {
      // Since we can't directly update passwords without auth, we'll use the password reset email
      console.log("Initiating force password reset for:", adminEmail);
      
      const { error } = await supabase.auth.resetPasswordForEmail(adminEmail, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });
      
      if (error) {
        console.error("Password reset error:", error);
        setDebugInfo(`Reset error: ${error.message}`);
        toast({
          title: "Password reset failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      setDebugInfo("Password reset email sent. Check your inbox.");
      toast({
        title: "Password reset email sent",
        description: "Please check your email to reset your password",
      });
      
    } catch (error: any) {
      console.error("Password reset unexpected error:", error);
      setDebugInfo(`Error: ${error.message}`);
      toast({
        title: "Password reset failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="mt-8 p-4 border border-yellow-300 bg-yellow-50 rounded-md">
      <h3 className="text-lg font-medium mb-2">Admin Account Debug Tools</h3>
      <p className="text-sm text-yellow-700 mb-4">
        Use these tools to troubleshoot admin login issues. These tools are only visible in debug mode.
      </p>
      
      <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={checkAdminAccount}
          disabled={isChecking}
          className="w-full"
        >
          {isChecking ? "Checking..." : "Check Admin Account"}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={forceResetAdminPassword}
          disabled={isResetting}
          className="w-full bg-red-50 text-red-600 hover:bg-red-100"
        >
          {isResetting ? "Sending..." : "Force Password Reset Email"}
        </Button>
        
        {debugInfo && (
          <div className="p-3 bg-gray-50 text-gray-700 rounded-md font-mono text-xs whitespace-pre-wrap">
            {debugInfo}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLoginDebugHelper;
