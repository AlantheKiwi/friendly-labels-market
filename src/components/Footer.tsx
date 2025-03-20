import React from "react";
import { Link } from "react-router-dom";
import { PhoneCall, Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return <footer className="bg-gray-100 pt-12 pb-6">
      <div className="container-custom">
        

        <div className="border-t border-gray-200 pt-6 mt-8">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              © {currentYear} Insight AI Systems Limited. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/terms" className="text-gray-600 text-sm hover:text-brand-blue transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-gray-600 text-sm hover:text-brand-blue transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;