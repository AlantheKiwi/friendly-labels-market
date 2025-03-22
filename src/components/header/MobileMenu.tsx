import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { user, signOut, isClient, isAdmin, refreshRoles } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Debug logging
  useEffect(() => {
    if (user) {
      console.log("MobileMenu - User is logged in:", user.id);
      console.log("MobileMenu - isClient:", isClient);
      console.log("MobileMenu - isAdmin:", isAdmin);
    } else {
      console.log("MobileMenu - No user logged in");
    }
  }, [user, isClient, isAdmin]);

  const handleSignOut = async () => {
    try {
      console.log("MobileMenu - Starting signOut process");
      onClose(); // Close the mobile menu immediately
      await signOut();
      console.log("MobileMenu - Signout completed");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Sign out failed",
        description: "There was an error signing out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleClientPortalClick = async () => {
    onClose(); // Close the mobile menu immediately
    
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
        
        {/* Always show Client Portal button */}
        <Button
          className="mx-4 flex items-center gap-2 justify-center"
          variant="outline"
          onClick={handleClientPortalClick}
        >
          <LayoutDashboard className="h-4 w-4" />
          Client Portal
        </Button>
        
        {/* Show logout for logged in users */}
        {user && (
          <button 
            className="px-4 py-2 hover:bg-gray-50 rounded-md font-medium flex items-center gap-2 w-full text-left"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        )}
        
        {/* Show login for users not logged in */}
        {!user && (
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
