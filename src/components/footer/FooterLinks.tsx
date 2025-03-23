
import React from "react";
import { Link } from "react-router-dom";

const FooterLinks: React.FC = () => {
  return (
    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
      <Link to="/terms-of-service" className="text-gray-600 text-sm hover:text-brand-blue transition-colors">
        Terms of Service
      </Link>
      <Link to="/privacy-policy" className="text-gray-600 text-sm hover:text-brand-blue transition-colors">
        Privacy Policy
      </Link>
    </div>
  );
};

export default FooterLinks;
