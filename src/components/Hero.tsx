import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, BadgeCheck, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
const Hero: React.FC = () => {
  return <div className="relative bg-gradient-to-r from-brand-blue/5 to-brand-blue/10 overflow-hidden">
      <div className="container-custom py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-brand-black mb-4">
              Premium Thermal Printer Labels
              <span className="text-brand-blue"> Delivered Next Day</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-md">
              High-quality thermal labels for shipping, barcodes, and product identification, delivered across New Zealand.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button asChild size="lg" className="btn-primary">
                <Link to="/products">Shop Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="btn-secondary">
                <Link to="/custom-quote">Request Custom Quote</Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-brand-blue mr-2" />
                <span className="text-sm font-medium">Next Day Delivery</span>
              </div>
              <div className="flex items-center">
                <BadgeCheck className="h-5 w-5 text-brand-blue mr-2" />
                <span className="text-sm font-medium">Premium Quality</span>
              </div>
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-brand-blue mr-2" />
                <span className="text-sm font-medium">Secure Payment</span>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block relative">
            <div className="aspect-square relative bg-white rounded-lg shadow-lg p-6 transform rotate-3">
              <img alt="Thermal printer labels" className="w-full h-full object-cover rounded" src="/lovable-uploads/bffa3899-aa28-4e2b-b49d-f919de9bee0a.jpg" />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-white p-4 rounded-lg shadow-lg transform -rotate-6 w-40">
              <div className="text-sm font-semibold mb-1">Bulk Orders</div>
              <div className="text-brand-blue font-bold">Save up to 30%</div>
            </div>
            <div className="absolute -top-4 -right-4 bg-brand-blue text-white p-4 rounded-full shadow-lg w-20 h-20 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xs font-medium">Fast</div>
                <div className="text-lg font-bold">NZ</div>
                <div className="text-xs font-medium">Shipping</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Hero;