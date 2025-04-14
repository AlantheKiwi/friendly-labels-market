
import React from "react";
import { Truck, BadgeCheck, RefreshCw } from "lucide-react";

const ProductBenefits: React.FC = () => {
  return (
    <div className="space-y-3 text-sm">
      <div className="flex items-center text-green-700">
        <Truck className="mr-2 h-4 w-4" />
        <span>Next-day delivery available for orders placed before 2pm</span>
      </div>
      <div className="flex items-center text-green-700">
        <BadgeCheck className="mr-2 h-4 w-4" />
        <span>Premium quality guaranteed</span>
      </div>
      <div className="flex items-center text-green-700">
        <RefreshCw className="mr-2 h-4 w-4" />
        <span>Easy returns within 30 days</span>
      </div>
    </div>
  );
};

export default ProductBenefits;
