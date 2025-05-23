
import React, { useRef, useCallback, useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CallToAction from "@/components/CallToAction";
import { printers as defaultPrinters } from "@/data/printerData";
import PrinterGrid from "@/components/PrinterGrid";
import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";
import PrinterCatalog from "@/components/PrinterCatalog";
import { Printer as PrinterType } from "@/types";

const PrintersPage = () => {
  const [printers, setPrinters] = useState<PrinterType[]>([]);
  
  // Load printers from localStorage or default data
  useEffect(() => {
    const storedPrinters = localStorage.getItem('printers');
    if (storedPrinters) {
      setPrinters(JSON.parse(storedPrinters));
    } else {
      // Initialize localStorage if empty
      localStorage.setItem('printers', JSON.stringify(defaultPrinters));
      setPrinters(defaultPrinters);
    }
  }, []);

  // Filter out printers with "Zebra" in their name and suspended printers
  const filteredPrinters = printers.filter(printer => 
    printer.name.includes("TSC") && 
    !printer.name.includes("Zebra") &&
    !printer.suspended
  );

  const pdfCatalogRef = useRef<HTMLDivElement>(null);

  // Use useCallback to create a stable function reference
  const handlePrintCatalog = useCallback(() => {
    if (pdfCatalogRef.current) {
      // Call useReactToPrint with the proper configuration
      const printCatalog = useReactToPrint({
        documentTitle: "Thermal_Printers_Catalog",
        onAfterPrint: () => console.log("PDF catalog generated successfully"),
        // Use contentRef instead of content
        contentRef: pdfCatalogRef,
      });
      
      // Execute the print function
      printCatalog();
    }
  }, [pdfCatalogRef]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="bg-gradient-to-r from-brand-blue/5 to-brand-blue/10 py-12">
          <div className="container-custom">
            <h1 className="heading-lg text-center mb-4">TSC Thermal Printers</h1>
            <p className="text-center text-gray-600 max-w-2xl mx-auto">
              Premium TSC Thermal Printers for Professional Label Printing.
            </p>
          </div>
        </div>

        <div className="container-custom py-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Printer className="mr-2 h-5 w-5 text-brand-blue" />
              TSC Printers ({filteredPrinters.length})
            </h2>
            
            <Button 
              onClick={handlePrintCatalog}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download PDF Catalog
            </Button>
          </div>
          
          <PrinterGrid printers={filteredPrinters} />
        </div>

        <CallToAction 
          title="Need Help Choosing the Right Printer?" 
          description="Our team is ready to assist you in finding the perfect TSC thermal printer for your business needs." 
          buttonText="Contact Us" 
          buttonLink="/contact" 
          secondaryButtonText="Browse Labels" 
          secondaryButtonLink="/products" 
        />
      </main>
      <Footer />
      
      {/* Hidden PDF catalog for printing */}
      <div className="hidden">
        <PrinterCatalog ref={pdfCatalogRef} printers={filteredPrinters} />
      </div>
    </div>
  );
};

export default PrintersPage;
