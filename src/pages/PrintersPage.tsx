
import React, { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CallToAction from "@/components/CallToAction";
import { printers } from "@/data/printerData";
import PrinterGrid from "@/components/PrinterGrid";

const PrintersPage = () => {
  useEffect(() => {
    console.log("Printer data loaded:", printers);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="bg-gradient-to-r from-brand-blue/5 to-brand-blue/10 py-12">
          <div className="container-custom">
            <h1 className="heading-lg text-center mb-4">Thermal Printers</h1>
            <p className="text-center text-gray-600 max-w-2xl mx-auto">
              Premium Thermal Printers from Trusted Brands – Now Available Through Our Reseller Partnership.
            </p>
          </div>
        </div>

        <div className="container-custom py-12">
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">All Printers ({printers.length})</h2>
            <PrinterGrid printers={printers} />
          </div>
        </div>

        <CallToAction 
          title="Need Help Choosing the Right Printer?" 
          description="Our team is ready to assist you in finding the perfect thermal printer for your business needs." 
          buttonText="Contact Us" 
          buttonLink="/contact" 
          secondaryButtonText="Browse Labels" 
          secondaryButtonLink="/products" 
        />
      </main>
      <Footer />
    </div>
  );
};

export default PrintersPage;
