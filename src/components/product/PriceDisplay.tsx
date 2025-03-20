import React from "react";
import { Badge } from "@/components/ui/badge";
import { ProductQuantity } from "@/types";
interface PriceDisplayProps {
  selectedQuantity: ProductQuantity | undefined;
}
const PriceDisplay: React.FC<PriceDisplayProps> = ({
  selectedQuantity
}) => {
  if (!selectedQuantity) return null;

  // Check if it's the specific quantity that needs a fixed price
  const shouldUseFixedPrice = selectedQuantity.id === "qty-3" && selectedQuantity.amount === 2000;
  return <div className="flex items-center justify-between mb-6">
      <div>
        <span className="text-3xl font-bold text-brand-blue">
          {shouldUseFixedPrice ? "$110.00" : `$${selectedQuantity.price.toFixed(2)}`}
        </span>
        {selectedQuantity.discountPercent > 0}
      </div>
      
      {selectedQuantity.discountPercent > 0 && <Badge className="bg-green-100 text-green-800 border-green-200">
          You save {selectedQuantity.discountPercent}%
        </Badge>}
    </div>;
};
export default PriceDisplay;