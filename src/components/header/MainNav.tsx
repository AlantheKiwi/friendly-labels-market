
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ClientPortalDialog from "./ClientPortalDialog";

const MainNav: React.FC = () => {
  const { user, isClient, isAdmin } = useAuth();

  // Added isAdmin check to show admin users the client portal button as well
  const showClientPortal = isClient || isAdmin;

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
      <ClientPortalDialog>
        <Button 
          variant="outline" 
          className="flex items-center gap-2" 
          size="sm"
        >
          <LayoutDashboard className="h-4 w-4" />
          Client Portal
        </Button>
      </ClientPortalDialog>
    </nav>
  );
};

export default MainNav;
