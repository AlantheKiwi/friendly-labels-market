
import React from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import FeatureSection from "@/components/FeatureSection";
import TestimonialSection from "@/components/TestimonialSection";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import { products } from "@/data/products";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="heading-lg mb-4">Our Products</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Browse our selection of high-quality thermal printer labels for all your business needs.
              </p>
            </div>
            <ProductGrid products={products} />
          </div>
        </section>
        
        <FeatureSection />
        <TestimonialSection />
        
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="text-center mb-8">
              <h2 className="heading-lg mb-4">How It Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Getting your thermal labels is quick and easy with our streamlined process.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-blue/10 text-brand-blue rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Choose Your Labels</h3>
                <p className="text-gray-600">
                  Select from our range of thermal labels and customize your order.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-blue/10 text-brand-blue rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Place Your Order</h3>
                <p className="text-gray-600">
                  Complete checkout with our secure payment options.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-blue/10 text-brand-blue rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Next-Day Delivery</h3>
                <p className="text-gray-600">
                  Receive your high-quality labels the next business day.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
