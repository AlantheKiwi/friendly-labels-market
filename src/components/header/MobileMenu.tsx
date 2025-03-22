import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ClientPortalDialog from "./ClientPortalDialog";
import { LayoutDashboard, LogIn } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden pt-4 pb-3 border-t border-gray-200 animate-fade-in">
      <nav className="flex flex-col space-y-4">
        <Link
          to="/"
          className="px-4 py-2 hover:bg-gray-50 rounded-md font-medium"
          onClick={onClose}
        >
          Home
        </Link>
        <Link
          to="/products"
          className="px-4 py-2 hover:bg-gray-50 rounded-md font-medium"
          onClick={onClose}
        >
          Products
        </Link>
        <Link
          to="/printers"
          className="px-4 py-2 hover:bg-gray-50 rounded-md font-medium"
          onClick={onClose}
        >
          Printers
        </Link>
        <Link
          to="/contact"
          className="px-4 py-2 hover:bg-gray-50 rounded-md font-medium"
          onClick={onClose}
        >
          Contact
        </Link>
        
        {/* Replace the previous Client Portal button with the dialog */}
        <div className="px-4">
          <ClientPortalDialog>
            <Button
              className="w-full flex items-center gap-2 justify-center"
              variant="outline"
            >
              <LayoutDashboard className="h-4 w-4" />
              Client Portal
            </Button>
          </ClientPortalDialog>
        </div>
        
        <Link
          to="/auth/login"
          className="px-4 py-2 hover:bg-gray-50 rounded-md font-medium flex items-center gap-2"
          onClick={onClose}
        >
          <LogIn className="h-4 w-4" />
          Login
        </Link>
      </nav>
    </div>
  );
};

export default MobileMenu;
