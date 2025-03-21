
import React from "react";
import { Link } from "react-router-dom";
import { LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { user, signOut, isClient, isAdmin } = useAuth();

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
        {isClient && user ? (
          <>
            <Link
              to="/client/dashboard"
              className="px-4 py-2 hover:bg-gray-50 rounded-md font-medium flex items-center gap-2"
              onClick={onClose}
            >
              <User className="h-4 w-4" />
              My Account
            </Link>
            <button 
              className="px-4 py-2 hover:bg-gray-50 rounded-md font-medium flex items-center gap-2 w-full text-left"
              onClick={() => {
                onClose();
                signOut();
              }}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </>
        ) : isAdmin && user ? (
          <>
            <Link
              to="/admin/dashboard"
              className="px-4 py-2 hover:bg-gray-50 rounded-md font-medium flex items-center gap-2"
              onClick={onClose}
            >
              <User className="h-4 w-4" />
              Admin Panel
            </Link>
            <button 
              className="px-4 py-2 hover:bg-gray-50 rounded-md font-medium flex items-center gap-2 w-full text-left"
              onClick={() => {
                onClose();
                signOut();
              }}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </>
        ) : !user && (
          <Link
            to="/auth/login"
            className="px-4 py-2 hover:bg-gray-50 rounded-md font-medium flex items-center gap-2"
            onClick={onClose}
          >
            <LogIn className="h-4 w-4" />
            Login
          </Link>
        )}
      </nav>
    </div>
  );
};

export default MobileMenu;
