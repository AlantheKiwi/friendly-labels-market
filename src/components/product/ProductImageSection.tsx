
import React from "react";

interface ProductImageSectionProps {
  imageUrl: string;
  name: string;
}

const ProductImageSection: React.FC<ProductImageSectionProps> = ({ imageUrl, name }) => {
  return (
    <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
      <img
        src={imageUrl}
        alt={name}
        className="max-w-full max-h-[400px] object-contain"
      />
    </div>
  );
};

export default ProductImageSection;
