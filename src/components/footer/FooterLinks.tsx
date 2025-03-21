
import React from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

const FooterLinks: React.FC = () => {
  return (
    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
      <Link to="/terms-of-service" className="text-gray-600 text-sm hover:text-brand-blue transition-colors">
        Terms of Service
      </Link>
      <Link to="/privacy-policy" className="text-gray-600 text-sm hover:text-brand-blue transition-colors">
        Privacy Policy
      </Link>
      <Link to="/admin/login" className="text-gray-600 text-sm hover:text-brand-blue transition-colors flex items-center gap-1">
        <Lock className="h-3 w-3" />
        Admin
      </Link>
    </div>
  );
};

export default FooterLinks;
