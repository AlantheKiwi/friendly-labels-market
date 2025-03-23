
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_EMAIL } from "@/services/auth/constants";

interface UseAdminAuthReturn {
  isAdmin: boolean;
  requirePasswordChange: boolean;
  loading: boolean;
  adminEmail: string | null;
  logout: () => void;
  refreshAdminStatus: () => Promise<void>;
}

export const useAdminAuth = (): UseAdminAuthReturn => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [requirePasswordChange, setRequirePasswordChange] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initial check for session and admin status
  useEffect(() => {
    async function checkAuth() {
      try {
        setLoading(true);
        
        // Get current session directly from Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No session found in useAdminAuth");
          setIsAdmin(false);
          setAdminEmail(null);
          return;
        }
        
        const userEmail = session.user?.email?.toLowerCase();
        setAdminEmail(userEmail || null);
        
        // Direct admin check by email - this is the most reliable method
        if (userEmail === ADMIN_EMAIL.toLowerCase()) {
          console.log("Admin email match found in useAdminAuth");
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
        
      } catch (error) {
        console.error("Error in useAdminAuth initial check:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }
    
    checkAuth();
    
    // Check local storage for password change requirement
    const requireChange = localStorage.getItem("requirePasswordChange") === "true";
    setRequirePasswordChange(requireChange);
  }, []);

  // Function to manually refresh admin status
  const refreshAdminStatus = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Get current session directly from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("No session found during refresh in useAdminAuth");
        setIsAdmin(false);
        setAdminEmail(null);
        return;
      }
      
      const userEmail = session.user?.email?.toLowerCase();
      setAdminEmail(userEmail || null);
      
      // Direct admin check by email
      if (userEmail === ADMIN_EMAIL.toLowerCase()) {
        console.log("Admin email match found during refresh in useAdminAuth");
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      
    } catch (error) {
      console.error("Error refreshing admin status:", error);
      setIsAdmin(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      localStorage.removeItem("requirePasswordChange");
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Error",
        description: "An error occurred during logout. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    isAdmin,
    requirePasswordChange,
    loading,
    adminEmail,
    logout,
    refreshAdminStatus
  };
};
