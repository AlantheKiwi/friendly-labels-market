import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="bg-brand-blue py-12 text-white">
        <div className="container-custom text-center">
          <h2 className="heading-md mb-4">
            Sign up to our newsletter
          </h2>
          <p className="text-lg mb-8">
            Stay up to date with our latest news and offers
          </p>
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <div className="flex rounded-md shadow-sm">
                <input
                  type="email"
                  className="block w-full min-w-0 flex-1 rounded-md rounded-r-none border-0 bg-white/5 py-1.5 text-white focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="Enter your email"
                />
                <button
                  type="button"
                  className="bg-brand-blue-dark px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-blue-darker focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-dark"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Service Labels NZ</h3>
            <p className="text-gray-600 mb-2">
              Unit 2/1 Doric Way, Islington 
              <br />
              Christchurch, New Zealand
            </p>
            <p className="mb-2">
              <span className="text-gray-600">020 4114 9601</span>
            </p>
            <p className="mb-4">
              <a
                href="mailto:sales@servicelabels.co.nz"
                className="text-brand-blue hover:text-brand-blue-dark transition-colors"
              >
                sales@servicelabels.co.nz
              </a>
            </p>
            
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.663 9.156 8.432 9.841v-6.299c0-.453.214-.902.58-1.202 1.087-.89 1.767-2.21 1.767-3.64 0-2.517-2.06-4.577-4.577-4.577-1.752 0-3.253 1.037-3.851 2.466-.079.233-.249.449-.459.577-.21.128-.453.19-.697.19-.452 0-.898-.229-1.164-.616a1.498 1.498 0 01-.305-.779c0-.833.672-1.505 1.505-1.505.418 0 .813.164 1.116.431.303.268.48.623.48 1.004v3.287c0 .453-.214.902-.58 1.202-1.087.89-1.767 2.21-1.767 3.64 0 2.517 2.06 4.577 4.577 4.577 1.752 0 3.253-1.037 3.851-2.466.079-.233.249-.449.459-.577.21-.128.453-.19.697-.19.452 0 .898.229 1.164.616.305.387.468.902.468 1.441v3.598c.686-.083 1.361-.208 2.014-.374V12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.379.06 3.808 0 2.43-.013 2.784-.06 3.808-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.379.06-3.808.06-2.43 0-2.784-.013-3.808-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.379-.06-3.808 0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465 1.024-.048 1.379-.06 3.808-.06zm0 2.16c-2.825 0-5.093 2.268-5.093 5.093 0 2.825 2.268 5.093 5.093 5.093 2.825 0 5.093-2.268 5.093-5.093 0-2.825-2.268-5.093-5.093-5.093zm0 8.4c-1.865 0-3.367-1.502-3.367-3.367 0-1.865 1.502-3.367 3.367-3.367 1.865 0 3.367 1.502 3.367 3.367 0 1.865-1.502 3.367-3.367 3.367zm4.612-10.764c.458 0 .828-.37.828-.828 0-.458-.37-.828-.828-.828-.458 0-.828.37-.828.828 0 .458.37.828.828.828z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.13 0-.259-.005-.384a8.344 8.344 0 001.132-2.37 8.344 8.344 0 01-2.405.64 4.169 4.169 0 001.13-2.277 8.344 8.344 0 01-2.664 1.079 4.169 4.169 0 00-2.982-1.664 4.169 4.169 0 00-1.799 2.277 8.344 8.344 0 01-.676 2.482 4.169 4.169 0 002.277 1.182 8.344 8.344 0 01-1.806-4.587 11.675 11.675 0 008.477 4.719 11.675 11.675 0 004.719-8.477 8.344 8.344 0 011.022 2.325 4.169 4.169 0 00-.644-2.05 8.344 8.344 0 012.277-.644 4.169 4.169 0 00-1.806 2.277 8.344 8.344 0 01-.676 2.482 4.169 4.169 0 002.277 1.182 11.675 11.675 0 01-7.384 4.794 11.675 11.675 0 01-4.794-7.384 8.344 8.344 0 001.132 2.37" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="text-gray-600">
              <li className="mb-2">
                <Link to="/" className="hover:text-brand-blue transition-colors">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/products" className="hover:text-brand-blue transition-colors">
                  Products
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="hover:text-brand-blue transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-blue transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="text-gray-600">
              <li className="mb-2">
                <Link to="/faq" className="hover:text-brand-blue transition-colors">
                  FAQ
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/shipping-returns" className="hover:text-brand-blue transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-brand-blue transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-600 mb-2">
              Have questions? Contact our support team.
            </p>
            <p className="mb-2">
              <span className="text-gray-600">Email:</span>
              <a
                href="mailto:support@example.com"
                className="text-brand-blue hover:text-brand-blue-dark transition-colors ml-1"
              >
                support@example.com
              </a>
            </p>
            <p>
              <span className="text-gray-600">Phone:</span>
              <span className="text-brand-blue ml-1">020 4114 9601</span>
            </p>
          </div>
        </div>
        
        {/* Copyright Section */}
        <div className="mt-12 border-t border-gray-200 pt-6 text-center text-gray-500">
          <p>&copy; {currentYear} Service Labels NZ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
