
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

// Import the new components
import Logo from "./header/Logo";
import MainNav from "./header/MainNav";
import UserActions from "./header/UserActions";
import CartButton from "./header/CartButton";
import MobileMenu from "./header/MobileMenu";

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Check if currently on client dashboard or not
  const isOnClientDashboard = location.pathname.startsWith('/client/');
  const isOnAdminDashboard = location.pathname.startsWith('/admin/');

  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 z-50">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <Logo />
          <MainNav />

          <div className="flex items-center gap-3">
            <UserActions 
              isOnClientDashboard={isOnClientDashboard} 
              isOnAdminDashboard={isOnAdminDashboard} 
            />
            
            <CartButton />

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <MobileMenu 
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
      </div>
    </header>
  );
};

export default Header;
