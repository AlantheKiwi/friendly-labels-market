
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AdminPasswordChangeProps {
  onComplete: () => void;
}

const DEFAULT_ADMIN_PASSWORD = "letmein1983!!";

const AdminPasswordChange: React.FC<AdminPasswordChangeProps> = ({ onComplete }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Password strength validation
  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
    
    if (password.length < minLength) {
      return "Password must be at least 8 characters long";
    }
    
    if (!hasUpperCase || !hasLowerCase) {
      return "Password must contain both uppercase and lowercase letters";
    }
    
    if (!hasNumbers) {
      return "Password must contain at least one number";
    }
    
    if (!hasSpecialChars) {
      return "Password must contain at least one special character";
    }
    
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate current password - compare with default password constant
    if (currentPassword !== DEFAULT_ADMIN_PASSWORD) {
      setError("Current password is incorrect");
      return;
    }
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    
    // Validate password strength
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    
    setLoading(true);
    
    try {
      // Actually update the password in Supabase
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (updateError) {
        console.error("Error updating password:", updateError);
        setError(updateError.message);
        setLoading(false);
        return;
      }
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully changed",
      });
      
      // Remove the flag that required password change
      localStorage.removeItem("requirePasswordChange");
      
      setLoading(false);
      onComplete();
    } catch (err) {
      console.error("Error updating password:", err);
      setError("An unexpected error occurred while updating your password");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      {error && <div className="p-3 bg-red-50 text-red-600 rounded-md">{error}</div>}
      
      <div className="space-y-2">
        <Label htmlFor="current-password">Current Password</Label>
        <Input
          id="current-password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <p className="text-xs text-gray-500">Default password: {DEFAULT_ADMIN_PASSWORD}</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="new-password">New Password</Label>
        <Input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <p className="text-xs text-gray-500">
          Password must be at least 8 characters long and contain uppercase, 
          lowercase, numbers, and special characters.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm New Password</Label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Updating..." : "Change Password"}
      </Button>
    </form>
  );
};

export default AdminPasswordChange;
