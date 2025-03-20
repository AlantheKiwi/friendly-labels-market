import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CartSidebar from "./CartSidebar";
const Header: React.FC = () => {
  const {
    itemCount
  } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return <header className="sticky top-0 bg-white border-b border-gray-200 z-50">
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
            <Link to="/bulk-ordering" className="font-medium hover:text-brand-blue transition-colors">
              Bulk Orders
            </Link>
            
            <Link to="/contact" className="font-medium hover:text-brand-blue transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && <span className="absolute -top-2 -right-2 bg-brand-blue text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {itemCount}
                    </span>}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <CartSidebar />
              </SheetContent>
            </Sheet>

            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="ml-2 md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && <div className="md:hidden pt-4 pb-3 border-t border-gray-200 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="px-4 py-2 hover:bg-gray-50 rounded-md font-medium" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link to="/products" className="px-4 py-2 hover:bg-gray-50 rounded-md font-medium" onClick={() => setMobileMenuOpen(false)}>
                Products
              </Link>
              <Link to="/bulk-ordering" className="px-4 py-2 hover:bg-gray-50 rounded-md font-medium" onClick={() => setMobileMenuOpen(false)}>
                Bulk Orders
              </Link>
              <Link to="/about" className="px-4 py-2 hover:bg-gray-50 rounded-md font-medium" onClick={() => setMobileMenuOpen(false)}>
                About Us
              </Link>
              <Link to="/contact" className="px-4 py-2 hover:bg-gray-50 rounded-md font-medium" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
            </nav>
          </div>}
      </div>
    </header>;
};
export default Header;