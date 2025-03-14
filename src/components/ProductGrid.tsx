
import React from "react";
import { Product } from "@/types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  title?: string;
  isLoading?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, title, isLoading = false }) => {
  return (
    <div className="w-full">
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div 
              key={index} 
              className="bg-gray-100 rounded-lg p-6 h-72 animate-pulse flex flex-col"
            >
              <div className="bg-gray-200 h-32 w-full rounded mb-4"></div>
              <div className="bg-gray-200 h-6 w-3/4 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 w-1/2 rounded mb-4"></div>
              <div className="mt-auto">
                <div className="bg-gray-200 h-10 w-full rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
