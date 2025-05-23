
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const MainNav: React.FC = () => {
  const { user, isAdmin } = useAuth();

  return (
    <nav className="hidden md:flex items-center space-x-6">
      <Link to="/" className="font-medium hover:text-brand-blue transition-colors">
        Home
      </Link>
      <Link to="/products" className="font-medium hover:text-brand-blue transition-colors">
        Products
      </Link>
      <Link to="/printers" className="font-medium hover:text-brand-blue transition-colors">
        Printers
      </Link>
      {isAdmin && (
        <>
          <Link to="/admin/dashboard" className="font-medium text-blue-600 hover:text-blue-800 transition-colors">
            Admin Dashboard
          </Link>
          <Link to="/admin/labels" className="font-medium hover:text-brand-blue transition-colors">
            Labels
          </Link>
          <Link to="/admin/clients" className="font-medium hover:text-brand-blue transition-colors">
            Clients
          </Link>
        </>
      )}
      <Link to="/contact" className="font-medium hover:text-brand-blue transition-colors">
        Contact
      </Link>
    </nav>
  );
};

export default MainNav;
