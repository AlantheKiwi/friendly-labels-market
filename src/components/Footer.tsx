
import React from "react";
import { Link } from "react-router-dom";
import { PhoneCall, Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 pt-12 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Printer Labels NZ</h3>
            <p className="text-gray-600 mb-4">
              Premium labels with next-day delivery across New Zealand. Trusted by businesses nationwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-brand-blue transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-brand-blue transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-brand-blue transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Products</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products/direct-thermal-labels" className="text-gray-600 hover:text-brand-blue transition-colors">
                  Direct Labels
                </Link>
              </li>
              <li>
                <Link to="/products/shipping-labels" className="text-gray-600 hover:text-brand-blue transition-colors">
                  Shipping Labels
                </Link>
              </li>
              <li>
                <Link to="/products/barcode-labels" className="text-gray-600 hover:text-brand-blue transition-colors">
                  Barcode Labels
                </Link>
              </li>
              <li>
                <Link to="/products/custom-labels" className="text-gray-600 hover:text-brand-blue transition-colors">
                  Custom Labels
                </Link>
              </li>
              <li>
                <Link to="/bulk-ordering" className="text-gray-600 hover:text-brand-blue transition-colors">
                  Bulk Ordering
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-brand-blue transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-brand-blue transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-600 hover:text-brand-blue transition-colors">
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-600 hover:text-brand-blue transition-colors">
                  Returns Policy
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-brand-blue transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <PhoneCall size={20} className="mr-2 text-brand-blue flex-shrink-0 mt-1" />
                <span className="text-gray-600">0800 123 456</span>
              </li>
              <li className="flex items-start">
                <Mail size={20} className="mr-2 text-brand-blue flex-shrink-0 mt-1" />
                <span className="text-gray-600">info@labelsnz.co.nz</span>
              </li>
              <li className="flex items-start">
                <MapPin size={20} className="mr-2 text-brand-blue flex-shrink-0 mt-1" />
                <span className="text-gray-600">
                  Insight AI Systems Limited<br />
                  Unit 2/1 Doric Way, Islington<br />
                  Christchurch, New Zealand
                </span>
              </li>
            </ul>
          </div>
        </div>

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
    </footer>
  );
};

export default Footer;
