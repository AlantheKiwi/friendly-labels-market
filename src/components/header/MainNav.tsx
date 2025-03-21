
import React from "react";
import { Link } from "react-router-dom";

const MainNav: React.FC = () => {
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
    </nav>
  );
};

export default MainNav;
