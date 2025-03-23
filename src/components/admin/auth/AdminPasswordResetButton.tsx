
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuthService } from '@/hooks/useAuthService';
import { AlertCircle } from 'lucide-react';

interface AdminPasswordResetButtonProps {
  className?: string;
}

const AdminPasswordResetButton: React.FC<AdminPasswordResetButtonProps> = ({ className }) => {
  const [isResetting, setIsResetting] = useState(false);
  const [devModeInfo, setDevModeInfo] = useState<string | null>(null);
  const { toast } = useToast();
  const authService = useAuthService();
  
  const handleResetPassword = async () => {
    if (!confirm('Are you sure you want to reset the admin password to default?')) {
      return;
    }
    
    setIsResetting(true);
    setDevModeInfo(null);
    
    try {
      const { data, error } = await authService.resetAdminPassword();
      
      const success = !error;
      const message = data?.message || (success ? 
        'Password reset successful' : 
        error?.message || 'Failed to reset password');
      
      toast({
        title: success ? 'Password Reset' : 'Reset Failed',
        description: message,
        variant: success ? 'default' : 'destructive',
      });
      
      // Development mode helper information
      if (process.env.NODE_ENV === 'development') {
        setDevModeInfo(`Development mode: Default admin password is "${authService.DEFAULT_ADMIN_PASSWORD}". 
          Email: ${authService.ADMIN_EMAIL}`);
      }
      
      if (success) {
        // If successful, you might want to update the UI or redirect
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error: any) {
      console.error('Error resetting admin password:', error);
      toast({
        title: 'Reset Failed',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
      
      // Provide development helper info on error
      if (process.env.NODE_ENV === 'development') {
        setDevModeInfo(`Development mode: Try using the default password "${authService.DEFAULT_ADMIN_PASSWORD}" directly.
          Email: ${authService.ADMIN_EMAIL}`);
      }
    } finally {
      setIsResetting(false);
    }
  };
  
  return (
    <div className={`mt-4 pt-4 border-t border-gray-200 ${className || ''}`}>
      <p className="text-sm text-gray-500 mb-2">
        Having trouble logging in? Try resetting the admin password:
      </p>
      <Button 
        variant="outline"
        onClick={handleResetPassword}
        disabled={isResetting}
        className="w-full"
      >
        {isResetting ? 'Resetting password...' : 'Reset Admin Password to Default'}
      </Button>
      
      {devModeInfo && (
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-800">
          <div className="flex items-start">
            <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
            <p className="whitespace-pre-line">{devModeInfo}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPasswordResetButton;
