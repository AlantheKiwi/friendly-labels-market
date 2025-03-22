
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const MainNav: React.FC = () => {
  const { user, isClient, refreshRoles } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleClientPortalClick = async () => {
    // If user is not logged in, redirect to login
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access the client portal",
      });
      navigate("/auth/login");
      return;
    }

    // If user is logged in but doesn't have client role, try to refresh roles
    if (!isClient) {
      toast({
        title: "Checking permissions",
        description: "Verifying your access to the client portal...",
      });
      
      try {
        const roles = await refreshRoles();
        if (roles.isClient) {
          navigate("/client/dashboard");
        } else {
          toast({
            title: "Access denied",
            description: "You don't have client portal access. Please contact support.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error refreshing roles:", error);
        toast({
          title: "Error checking permissions",
          description: "There was a problem verifying your access. Please try again.",
          variant: "destructive"
        });
      }
      return;
    }

    // If user is already verified as client, just navigate
    navigate("/client/dashboard");
  };

  return (
    <nav className="hidden md:flex items-center space-x-8">
      <Link to="/" className="font-medium hover:text-brand-blue transition-colors">
        Home
      </Link>
      <Link to="/products" className="font-medium hover:text-brand-blue transition-colors">
        Products
      </Link>
      <Link to="/printers" className="font-medium hover:text-brand-blue transition-colors">
        Printers
      </Link>
      <Link to="/contact" className="font-medium hover:text-brand-blue transition-colors">
        Contact
      </Link>
      <Button 
        variant="outline" 
        className="flex items-center gap-2" 
        onClick={handleClientPortalClick}
        size="sm"
      >
        <LayoutDashboard className="h-4 w-4" />
        Client Portal
      </Button>
    </nav>
  );
};

export default MainNav;
