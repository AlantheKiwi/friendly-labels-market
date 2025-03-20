
import React, { useRef, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CallToAction from "@/components/CallToAction";
import { printers } from "@/data/printerData";
import PrinterGrid from "@/components/PrinterGrid";
import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";
import PrinterCatalog from "@/components/PrinterCatalog";

const PrintersPage = () => {
  const pdfCatalogRef = useRef<HTMLDivElement>(null);

  // Use useCallback to create a stable function reference
  const handlePrintCatalog = useCallback(() => {
    if (pdfCatalogRef.current) {
      // Call useReactToPrint with the proper configuration
      useReactToPrint({
        documentTitle: "Thermal_Printers_Catalog",
        onAfterPrint: () => console.log("PDF catalog generated successfully"),
        content: () => pdfCatalogRef.current,
      })();
    }
  }, [pdfCatalogRef]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="bg-gradient-to-r from-brand-blue/5 to-brand-blue/10 py-12">
          <div className="container-custom">
            <h1 className="heading-lg text-center mb-4">Thermal Printers</h1>
            <p className="text-center text-gray-600 max-w-2xl mx-auto">
              Premium Thermal Printers from Trusted Brands.
            </p>
          </div>
        </div>

        <div className="container-custom py-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Printer className="mr-2 h-5 w-5 text-brand-blue" />
              All Printers ({printers.length})
            </h2>
            
            <Button 
              onClick={handlePrintCatalog}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download PDF Catalog
            </Button>
          </div>
          
          <PrinterGrid printers={printers} />
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
      
      {/* Hidden PDF catalog for printing */}
      <div className="hidden">
        <PrinterCatalog ref={pdfCatalogRef} printers={printers} />
      </div>
    </div>
  );
};

export default PrintersPage;
