
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
  const { user, isAdmin: isAdminFromContext, isLoading, signOut } = useAuth();
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
    isAdmin: isAdminFromContext,
    requirePasswordChange,
    loading: isLoading,
    adminEmail: user?.email || null,
    logout
  };
};
