
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface UseAdminAuthReturn {
  isAdmin: boolean;
  requirePasswordChange: boolean;
  loading: boolean;
  adminEmail: string | null;
  logout: () => void;
}

export const useAdminAuth = (): UseAdminAuthReturn => {
  // Try to use auth context, but provide fallbacks if it fails
  let user = null;
  let isAdmin = false;
  let isLoading = true;
  let signOut = async () => {};
  
  try {
    const authContext = useAuth();
    user = authContext.user;
    isAdmin = authContext.isAdmin;
    isLoading = authContext.isLoading;
    signOut = authContext.signOut;
  } catch (error) {
    console.error("Error accessing auth context in useAdminAuth:", error);
  }
  
  const [requirePasswordChange, setRequirePasswordChange] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check local storage for password change requirement
    const requireChange = localStorage.getItem("requirePasswordChange") === "true";
    setRequirePasswordChange(requireChange);
  }, []);

  const logout = () => {
    signOut().then(() => {
      localStorage.removeItem("requirePasswordChange");
      navigate("/");
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    });
  };

  return {
    isAdmin,
    requirePasswordChange,
    loading: isLoading,
    adminEmail: user?.email || null,
    logout
  };
};
