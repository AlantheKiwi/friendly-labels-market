
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X, Printer, User, LogIn } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CartSidebar from "./CartSidebar";

const Header: React.FC = () => {
  const { itemCount } = useCart();
  const { user, signOut, isClient } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 z-50">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <div className="text-xl font-bold text-brand-blue">
              Service Labels <span className="text-brand-black">NZ</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
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
          </nav>

          <div className="flex items-center gap-3">
            {/* Client Login/Account Button */}
            {user ? (
              isClient ? (
                <Button variant="outline" className="flex items-center gap-2" size="sm" asChild>
                  <Link to="/client/dashboard">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">My Account</span>
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" className="flex items-center gap-2" onClick={signOut} size="sm">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              )
            ) : (
              <Button variant="outline" className="flex items-center gap-2" size="sm" asChild>
                <Link to="/auth/login">
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Client Login</span>
                </Link>
              </Button>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-brand-blue text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <CartSidebar />
              </SheetContent>
            </Sheet>

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
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-gray-200 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="px-4 py-2 hover:bg-gray-50 rounded-md font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="px-4 py-2 hover:bg-gray-50 rounded-md font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/printers"
                className="px-4 py-2 hover:bg-gray-50 rounded-md font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Printers
              </Link>
              <Link
                to="/contact"
                className="px-4 py-2 hover:bg-gray-50 rounded-md font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              {isClient && user ? (
                <Link
                  to="/client/dashboard"
                  className="px-4 py-2 hover:bg-gray-50 rounded-md font-medium flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  My Account
                </Link>
              ) : !user && (
                <Link
                  to="/auth/login"
                  className="px-4 py-2 hover:bg-gray-50 rounded-md font-medium flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
