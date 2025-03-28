
import React from "react";
import { ProductQuantity } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductQuantitySelectorProps {
  quantities: ProductQuantity[];
  selectedQuantityId: string;
  onSelectQuantity: (quantityId: string) => void;
  isCustom?: boolean;
}

const ProductQuantitySelector: React.FC<ProductQuantitySelectorProps> = ({
  quantities,
  selectedQuantityId,
  onSelectQuantity,
  isCustom = false
}) => {
  if (isCustom) {
    return <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Quantity</h3>
        <Card className="border-brand-blue">
          <CardContent className="p-6">
            <p className="text-lg font-medium mb-2">Custom Order</p>
            <p className="text-gray-600">
              Contact us for a custom quote based on your specific requirements.
            </p>
          </CardContent>
        </Card>
      </div>;
  }

  return <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">Select Quantity</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quantities.map(quantity => <Card key={quantity.id} className={cn("cursor-pointer transition-all hover:border-brand-blue/60 hover:shadow-md", selectedQuantityId === quantity.id ? "border-2 border-brand-blue" : "border border-gray-200")} onClick={() => onSelectQuantity(quantity.id)}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xl font-bold">
                  {quantity.amount.toLocaleString()}
                </span>
                {selectedQuantityId === quantity.id && <span className="bg-brand-blue rounded-full p-1">
                    <Check className="h-4 w-4 text-white" />
                  </span>}
              </div>
              <div className="flex justify-between items-baseline mb-1">
                <div>
                  <span className="text-2xl font-bold text-brand-blue">
                    ${quantity.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">Ex GST</span>
                </div>
              </div>
              {quantity.isPopular && <div className="absolute top-0 right-0 bg-brand-blue text-white text-xs py-1 px-2 rounded-br-sm rounded-tl-md">
                  Popular
                </div>}
            </CardContent>
          </Card>)}
      </div>
    </div>;
};

export default ProductQuantitySelector;
