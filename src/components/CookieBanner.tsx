
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a cookie choice
    const cookieChoice = localStorage.getItem("cookieChoice");
    if (!cookieChoice) {
      // Show cookie banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieChoice", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieChoice", "declined");
    setIsVisible(false);
  };

  const handleCustomize = () => {
    // For now, this just accepts all cookies
    // This could be expanded with a modal for granular cookie control
    localStorage.setItem("cookieChoice", "customized");
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 p-4 border-t border-gray-200">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-700 pr-4">
              We use cookies to enhance your experience on our website. By continuing to browse, you agree to our{" "}
              <Link to="/privacy-policy" className="text-brand-blue hover:underline">
                Privacy Policy
              </Link>
              . You can customize your cookie preferences at any time.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Button onClick={handleAccept} size="sm" className="whitespace-nowrap">
              Accept All
            </Button>
            <Button onClick={handleCustomize} size="sm" variant="outline" className="whitespace-nowrap">
              Customize Settings
            </Button>
            <Button onClick={handleDecline} size="sm" variant="outline" className="whitespace-nowrap">
              Decline
            </Button>
          </div>
          <button 
            onClick={handleClose} 
            className="absolute top-2 right-2 md:static p-1 text-gray-500 hover:text-gray-700"
            aria-label="Close cookie banner"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
