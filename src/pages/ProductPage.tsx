import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Check, Truck, BadgeCheck, RefreshCw } from "lucide-react";
import ProductSizeSelector from "@/components/ProductSizeSelector";
import ProductQuantitySelector from "@/components/ProductQuantitySelector";
import { getProductBySlug } from "@/data/productUtils";
import { useCart } from "@/context/CartContext";
import CallToAction from "@/components/CallToAction";
import { useToast } from "@/hooks/use-toast";

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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container-custom py-8">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/products")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="max-w-full max-h-[400px] object-contain"
              />
            </div>

            {/* Product Details */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="bg-brand-blue/10 text-brand-blue">
                  {product.category}
                </Badge>
                {!product.isCustom && (
                  <span className="text-gray-500 text-sm">
                    {product.sizes.length} size options available
                  </span>
                )}
              </div>

              <p className="text-gray-700 mb-6">{product.description}</p>

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

                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-3xl font-bold text-brand-blue">
                        $110.00
                      </span>
                      {selectedQuantity?.discountPercent > 0 && (
                        <span className="text-gray-500 line-through ml-2">
                          ${selectedQuantity?.basePrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    
                    {selectedQuantity?.discountPercent > 0 && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        You save {selectedQuantity?.discountPercent}%
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 mb-8">
                    <Button
                      onClick={handleAddToCart}
                      className="flex-1 md:flex-none md:min-w-[200px]"
                    >
                      Add to Cart
                    </Button>
                    <Button
                      onClick={handleBuyNow}
                      variant="outline"
                      className="flex-1 md:flex-none md:min-w-[200px]"
                    >
                      Buy Now
                    </Button>
                  </div>
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

                  <div className="mb-8">
                    <Button
                      onClick={() => navigate("/custom-quote")}
                      className="min-w-[200px]"
                    >
                      Request Quote
                    </Button>
                  </div>
                </>
              )}

              <div className="space-y-3 text-sm">
                <div className="flex items-center text-green-700">
                  <Truck className="mr-2 h-4 w-4" />
                  <span>Next-day delivery available for orders placed before 2pm</span>
                </div>
                <div className="flex items-center text-green-700">
                  <BadgeCheck className="mr-2 h-4 w-4" />
                  <span>Premium quality guaranteed</span>
                </div>
                <div className="flex items-center text-green-700">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  <span>Easy returns within 30 days</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-12" />

          {/* Product Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Features</h2>
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="bg-brand-blue/10 rounded-full p-1 mr-3">
                      <Check className="h-4 w-4 text-brand-blue" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6">Popular Uses</h2>
              <ul className="space-y-3">
                {product.popularUses.map((use, index) => (
                  <li key={index} className="flex items-center">
                    <span className="bg-brand-blue/10 rounded-full p-1 mr-3">
                      <Check className="h-4 w-4 text-brand-blue" />
                    </span>
                    {use}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <CallToAction
          title="Need Help Choosing the Right Labels?"
          description="Our team is ready to assist you in finding the perfect thermal labels for your business needs."
          buttonText="Contact Us"
          buttonLink="/contact"
          secondaryButtonText="Browse More Products"
          secondaryButtonLink="/products"
        />
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;
