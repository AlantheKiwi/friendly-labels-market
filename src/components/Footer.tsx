
import React from "react";
import FooterLinks from "./footer/FooterLinks";
import FooterCopyright from "./footer/FooterCopyright";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 pt-12 pb-6">
      <div className="container-custom">
        <div className="border-t border-gray-200 pt-6 mt-8">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <FooterCopyright />
            <FooterLinks />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
