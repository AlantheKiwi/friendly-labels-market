
import React from "react";
import { Link } from "react-router-dom";
import { Product } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
interface ProductCardProps {
  product: Product;
}
const ProductCard: React.FC<ProductCardProps> = ({
  product
}) => {
  // Find the lowest price from available quantities
  const lowestPrice = Math.min(...product.quantities.map(q => q.price));

  // Find the most popular quantity (or the first one if none is marked as popular)
  const popularQuantity = product.quantities.find(q => q.isPopular) || product.quantities[0];
  return <Link to={`/products/${product.slug}`}>
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
          <img src={product.imageUrl !== "/placeholder.svg" ? product.imageUrl : "/lovable-uploads/b244118b-edda-4ebc-9ee8-5ccac70f30dc.png"} alt={product.name} className="h-full w-full transition-transform duration-500 hover:scale-105 object-cover" />
        </div>
        <CardContent className="p-5">
          <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
          
          {product.isCustom ? <div className="flex items-center mt-3">
              <Badge variant="outline" className="bg-brand-blue/10 text-brand-blue border-brand-blue/30">
                Custom Quote
              </Badge>
            </div> : <>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                {product.sizes.length > 0 ? `Available in ${product.sizes.length} size${product.sizes.length > 1 ? 's' : ''}` : ''}
              </p>
              
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xl font-bold text-brand-blue">
                    ${lowestPrice.toFixed(2)}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">
                    from <span className="text-xs">Ex GST</span>
                  </span>
                </div>
                
                <span className="text-brand-blue flex items-center text-sm font-medium">
                  View Details 
                  <ArrowRight size={16} className="ml-1" />
                </span>
              </div>
              
              {popularQuantity && popularQuantity.discountPercent > 0 && <div className="mt-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Save {popularQuantity.discountPercent}% on {popularQuantity.amount} labels
                  </Badge>
                </div>}
            </>}
        </CardContent>
      </Card>
    </Link>;
};
export default ProductCard;
