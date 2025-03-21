
import React from "react";
import { Link } from "react-router-dom";

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center">
      <div className="text-xl font-bold text-brand-blue">
        Service Labels <span className="text-brand-black">NZ</span>
      </div>
    </Link>
  );
};

export default Logo;
