
import React from "react";
import { Button } from "@/components/ui/button";

interface ProductButtonsProps {
  onAddToCart: () => void;
  onBuyNow: () => void;
  isCustom: boolean;
  onRequestQuote: () => void;
}

const ProductButtons: React.FC<ProductButtonsProps> = ({
  onAddToCart,
  onBuyNow,
  isCustom,
  onRequestQuote,
}) => {
  if (isCustom) {
    return (
      <div className="mb-8">
        <Button onClick={onRequestQuote} className="min-w-[200px]">
          Request Quote
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <Button
        onClick={onAddToCart}
        className="flex-1 md:flex-none md:min-w-[200px]"
      >
        Add to Cart
      </Button>
      <Button
        onClick={onBuyNow}
        variant="outline"
        className="flex-1 md:flex-none md:min-w-[200px]"
      >
        Buy Now
      </Button>
    </div>
  );
};

export default ProductButtons;
