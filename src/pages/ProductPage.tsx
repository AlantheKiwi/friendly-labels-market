
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import ProductSizeSelector from "@/components/ProductSizeSelector";
import ProductQuantitySelector from "@/components/ProductQuantitySelector";
import { getProductBySlug } from "@/data/productUtils";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import ProductLayout from "@/components/product/ProductLayout";
import ProductImageSection from "@/components/product/ProductImageSection";
import ProductHeader from "@/components/product/ProductHeader";
import PriceDisplay from "@/components/product/PriceDisplay";
import ProductButtons from "@/components/product/ProductButtons";
import ProductBenefits from "@/components/product/ProductBenefits";
import ProductFeatures from "@/components/product/ProductFeatures";

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const product = getProductBySlug(slug || "");
  const { addToCart } = useCart();
  const { toast } = useToast();

  const [selectedSizeId, setSelectedSizeId] = useState("");
  const [selectedQuantityId, setSelectedQuantityId] = useState("");

  useEffect(() => {
    if (!product) {
      navigate("/products");
      return;
    }

    // Set default selections
    if (product.sizes.length > 0) {
      setSelectedSizeId(product.sizes[0].id);
    }

    // Find the popular quantity or use the first one
    const popularQuantity = product.quantities.find((q) => q.isPopular);
    if (popularQuantity) {
      setSelectedQuantityId(popularQuantity.id);
    } else if (product.quantities.length > 0) {
      setSelectedQuantityId(product.quantities[0].id);
    }
  }, [product, navigate]);

  if (!product) {
    return null;
  }

  const selectedSize = product.sizes.find((size) => size.id === selectedSizeId);
  const selectedQuantity = product.quantities.find((qty) => qty.id === selectedQuantityId);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedQuantity) {
      toast({
        title: "Please select options",
        description: "Please select a size and quantity before adding to cart",
        variant: "destructive",
      });
      return;
    }

    addToCart(product, selectedSize, selectedQuantity);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  return (
    <ProductLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <ProductImageSection 
          imageUrl={product.imageUrl} 
          name={product.name} 
        />

        {/* Product Details */}
        <div>
          <ProductHeader
            name={product.name}
            category={product.category}
            description={product.description}
            sizeCount={product.sizes.length}
            isCustom={!!product.isCustom}
          />

          {!product.isCustom ? (
            <>
              <ProductSizeSelector
                sizes={product.sizes}
                selectedSizeId={selectedSizeId}
                onSelectSize={setSelectedSizeId}
              />

              <ProductQuantitySelector
                quantities={product.quantities}
                selectedQuantityId={selectedQuantityId}
                onSelectQuantity={setSelectedQuantityId}
              />

              <PriceDisplay selectedQuantity={selectedQuantity} />

              <ProductButtons
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                isCustom={false}
                onRequestQuote={() => {}}
              />
            </>
          ) : (
            <>
              <ProductSizeSelector
                sizes={product.sizes}
                selectedSizeId={selectedSizeId}
                onSelectSize={setSelectedSizeId}
                isCustom={true}
              />

              <ProductQuantitySelector
                quantities={product.quantities}
                selectedQuantityId={selectedQuantityId}
                onSelectQuantity={setSelectedQuantityId}
                isCustom={true}
              />

              <ProductButtons
                onAddToCart={() => {}}
                onBuyNow={() => {}}
                isCustom={true}
                onRequestQuote={() => navigate("/custom-quote")}
              />
            </>
          )}

          <ProductBenefits />
        </div>
      </div>

      <Separator className="my-12" />

      {/* Product Features */}
      <ProductFeatures 
        features={product.features} 
        popularUses={product.popularUses} 
      />
    </ProductLayout>
  );
};

export default ProductPage;
