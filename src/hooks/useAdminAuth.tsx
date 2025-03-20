
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface UseAdminAuthReturn {
  isAdmin: boolean;
  requirePasswordChange: boolean;
  loading: boolean;
  adminEmail: string | null;
  logout: () => void;
}

export const useAdminAuth = (): UseAdminAuthReturn => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [requirePasswordChange, setRequirePasswordChange] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check local storage for admin status
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    const requireChange = localStorage.getItem("requirePasswordChange") === "true";
    const email = localStorage.getItem("adminEmail");
    
    setIsAdmin(adminLoggedIn);
    setRequirePasswordChange(requireChange);
    setAdminEmail(email);
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("requirePasswordChange");
    setIsAdmin(false);
    setAdminEmail(null);
    navigate("/");
  };

  return {
    isAdmin,
    requirePasswordChange,
    loading,
    adminEmail,
    logout
  };
};
