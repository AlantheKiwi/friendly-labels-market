
import React from "react";
import { Badge } from "@/components/ui/badge";
import { ProductQuantity } from "@/types";

interface PriceDisplayProps {
  selectedQuantity: ProductQuantity | undefined;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ selectedQuantity }) => {
  if (!selectedQuantity) return null;
  
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <span className="text-3xl font-bold text-brand-blue">
          ${selectedQuantity.price.toFixed(2)}
        </span>
        {selectedQuantity.discountPercent > 0 && (
          <span className="text-gray-500 line-through ml-2">
            ${selectedQuantity.basePrice.toFixed(2)}
          </span>
        )}
      </div>
      
      {selectedQuantity.discountPercent > 0 && (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          You save {selectedQuantity.discountPercent}%
        </Badge>
      )}
    </div>
  );
};

export default PriceDisplay;
