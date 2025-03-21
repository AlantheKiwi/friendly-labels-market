
import React from "react";

const FooterCopyright: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <p className="text-gray-600 text-sm mb-4 md:mb-0">
      © {currentYear} Insight AI Systems Limited. All rights reserved.
    </p>
  );
};

export default FooterCopyright;
