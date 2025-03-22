
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { user, isClient, signOut } = useAuth();
  
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
        
        {/* Authentication Links */}
        {user ? (
          <>
            <div className="border-t border-gray-200 my-2 pt-2">
              <div className="px-4 py-2 bg-blue-50 rounded-md mb-2">
                <p className="font-medium text-blue-800">
                  {user.user_metadata?.first_name 
                    ? `Hello, ${user.user_metadata.first_name}!` 
                    : `Hello!`}
                </p>
                <p className="text-sm text-blue-600 truncate">{user.email}</p>
              </div>
            </div>
            
            {isClient && (
              <Link
                to="/client/dashboard"
                className="px-4 py-2 bg-gray-50 rounded-md font-medium flex items-center"
                onClick={onClose}
              >
                <User className="h-4 w-4 mr-2" />
                Client Dashboard
              </Link>
            )}
            
            <Button
              variant="ghost"
              className="mx-4 justify-start text-gray-600"
              onClick={() => {
                signOut();
                onClose();
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </>
        ) : (
          <Link
            to="/auth/login"
            className="px-4 py-2 bg-blue-50 rounded-md font-medium flex items-center"
            onClick={onClose}
          >
            <LogIn className="h-4 w-4 mr-2" />
            Sign In / Register
          </Link>
        )}
      </nav>
    </div>
  );
};

export default MobileMenu;
