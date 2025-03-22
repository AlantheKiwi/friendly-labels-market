
import React from "react";
import { Link } from "react-router-dom";

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
        
        {/* Client Portal link is now only in the UserActions component */}
      </nav>
    </div>
  );
};

export default MobileMenu;
