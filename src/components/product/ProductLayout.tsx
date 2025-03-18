
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CallToAction from "@/components/CallToAction";

interface ProductLayoutProps {
  children: React.ReactNode;
}

const ProductLayout: React.FC<ProductLayoutProps> = ({ children }) => {
  const navigate = useNavigate();

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

          {children}
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

export default ProductLayout;
