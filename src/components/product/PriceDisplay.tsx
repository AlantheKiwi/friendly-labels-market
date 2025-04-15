
import React from "react";
import { ProductQuantity } from "@/types";

interface PriceDisplayProps {
  selectedQuantity: ProductQuantity | undefined;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  selectedQuantity
}) => {
  if (!selectedQuantity) return null;

  return <div className="flex items-center justify-between mb-6">
      <div>
        <span className="text-3xl font-bold text-brand-blue">
          ${selectedQuantity.price.toFixed(2)}
        </span>
        <span className="text-sm text-gray-500 ml-1">Ex GST</span>
      </div>
    </div>;
};

export default PriceDisplay;
