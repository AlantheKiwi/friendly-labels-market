
import React from "react";
import { ProductSize } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProductSizeSelectorProps {
  sizes: ProductSize[];
  selectedSizeId: string;
  onSelectSize: (sizeId: string) => void;
  isCustom?: boolean;
}

const ProductSizeSelector: React.FC<ProductSizeSelectorProps> = ({
  sizes,
  selectedSizeId,
  onSelectSize,
  isCustom = false,
}) => {
  if (isCustom) {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Size</h3>
        <Card>
          <CardContent className="p-6">
            <p className="text-lg font-medium">Custom Dimensions</p>
            <p className="text-gray-600">
              We can produce labels in any size to meet your specific requirements.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">Select Size</h3>
      <RadioGroup
        value={selectedSizeId}
        onValueChange={onSelectSize}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {sizes.map((size) => (
          <div key={size.id}>
            <RadioGroupItem
              value={size.id}
              id={size.id}
              className="peer sr-only"
            />
            <Label
              htmlFor={size.id}
              className={cn(
                "flex flex-col border rounded-md p-4 cursor-pointer transition-all",
                "hover:border-brand-blue/60 hover:bg-brand-blue/5",
                "peer-data-[state=checked]:border-brand-blue peer-data-[state=checked]:bg-brand-blue/5"
              )}
            >
              <span className="font-medium mb-1">{size.name}</span>
              <span className="text-gray-500 text-sm">{size.dimensions}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default ProductSizeSelector;
