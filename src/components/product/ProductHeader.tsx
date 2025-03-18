
import React from "react";
import { Badge } from "@/components/ui/badge";

interface ProductHeaderProps {
  name: string;
  category: string;
  description: string;
  sizeCount: number;
  isCustom: boolean;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({
  name,
  category,
  description,
  sizeCount,
  isCustom,
}) => {
  return (
    <>
      <h1 className="text-3xl font-bold mb-2">{name}</h1>
      
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="outline" className="bg-brand-blue/10 text-brand-blue">
          {category}
        </Badge>
        {!isCustom && (
          <span className="text-gray-500 text-sm">
            {sizeCount} size options available
          </span>
        )}
      </div>

      <p className="text-gray-700 mb-6">{description}</p>
    </>
  );
};

export default ProductHeader;
