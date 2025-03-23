
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { products } from "@/data/productData";
import ProductGrid from "@/components/ProductGrid";
import CallToAction from "@/components/CallToAction";

const ProductsPage = () => {
  // Filter out suspended products
  const activeProducts = products.filter(product => !product.suspended);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-gradient-to-r from-brand-blue/5 to-brand-blue/10 py-12">
          <div className="container-custom">
            <h1 className="heading-lg text-center mb-4">Printer Labels</h1>
            <p className="text-center text-gray-600 max-w-2xl mx-auto">
              Browse our complete range of high-quality labels for all your business needs. Next-day delivery available across New Zealand.
            </p>
          </div>
        </div>

        <div className="container-custom py-12">
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">All Products</h2>
            <ProductGrid products={activeProducts} />
          </div>
        </div>

        <CallToAction 
          title="Can't Find What You're Looking For?" 
          description="We offer custom label solutions tailored to your specific requirements." 
          buttonText="Request Custom Quote" 
          buttonLink="/custom-quote" 
          secondaryButtonText="Contact Us" 
          secondaryButtonLink="/contact" 
        />
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;
