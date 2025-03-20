
import React, { forwardRef } from "react";
import { Printer } from "@/types";
import { AlertCircle, BadgePercent } from "lucide-react";

interface PrinterCatalogProps {
  printers: Printer[];
}

const PrinterCatalog = forwardRef<HTMLDivElement, PrinterCatalogProps>(
  ({ printers }, ref) => {
    const getImageSrc = (printer: Printer) => {
      // Fallback images from PrinterCard
      const fallbackImages: Record<number, string> = {
        1: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&h=600",
        2: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&h=600",
        3: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&h=600",
        4: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&h=600",
        5: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&h=600",
        6: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&h=600&q=80",
        7: "https://images.unsplash.com/photo-1533310266320-f7f9f6067419?auto=format&fit=crop&w=800&h=600&q=80",
        8: "https://images.unsplash.com/photo-1563770660941-10971f1f61a8?auto=format&fit=crop&w=800&h=600&q=80",
        9: "https://images.unsplash.com/photo-1581092921461-39b9d347a569?auto=format&fit=crop&w=800&h=600&q=80",
        10: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&h=600&q=80",
        11: "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?auto=format&fit=crop&w=800&h=600&q=80",
        12: "https://images.unsplash.com/photo-1563502321-4e4f507445e7?auto=format&fit=crop&w=800&h=600&q=80"
      };
      
      return printer.imageUrl || fallbackImages[printer.id] || "";
    };

    const formatPrice = (printer: Printer) => {
      if (printer.contactForPrice) {
        return "Contact for Price";
      } else if (printer.onSale) {
        return `$${printer.price.toFixed(2)} ${printer.gstIncluded ? 'Incl. GST' : 'Excl. GST'} (was $${printer.originalPrice?.toFixed(2)})`;
      } else if (printer.priceRange) {
        return `${printer.priceRange} ${printer.gstIncluded ? 'Incl. GST' : 'Excl. GST'}`;
      } else {
        return `$${printer.price.toFixed(2)} ${printer.gstIncluded ? 'Incl. GST' : 'Excl. GST'}`;
      }
    };

    // Split printers into two columns for A4 layout
    const firstColumn = printers.slice(0, Math.ceil(printers.length / 2));
    const secondColumn = printers.slice(Math.ceil(printers.length / 2));

    return (
      <div ref={ref} className="pdf-container bg-white p-8 w-[210mm] mx-auto font-sans">
        {/* Header with Logo and Title */}
        <div className="header text-center mb-8">
          <h1 className="text-2xl font-bold text-brand-blue mb-2">Service Labels NZ</h1>
          <p className="text-gray-600">https://servicelabels.co.nz</p>
          <h2 className="text-xl font-semibold mt-4">Thermal Printer Catalog</h2>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-row gap-6">
          {/* First Column */}
          <div className="flex-1">
            {firstColumn.map((printer) => (
              <div key={printer.id} className="printer-item mb-6 border-b pb-4">
                <div className="relative h-32 mb-2 bg-gray-50 flex items-center justify-center">
                  {printer.onSale && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 flex items-center">
                      <BadgePercent className="h-3 w-3 mr-1" /> Sale
                    </div>
                  )}
                  <img
                    src={getImageSrc(printer)}
                    alt={printer.name}
                    className="h-full max-h-28 object-contain"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "";
                      e.currentTarget.alt = "Image unavailable";
                      e.currentTarget.parentElement?.classList.add("img-error");
                    }}
                  />
                </div>
                <h3 className="font-semibold text-sm mb-1">{printer.name}</h3>
                <p className="text-xs text-gray-600 mb-2 line-clamp-3">{printer.description}</p>
                <p className="text-sm font-bold text-brand-blue">{formatPrice(printer)}</p>
              </div>
            ))}
          </div>

          {/* Second Column */}
          <div className="flex-1">
            {secondColumn.map((printer) => (
              <div key={printer.id} className="printer-item mb-6 border-b pb-4">
                <div className="relative h-32 mb-2 bg-gray-50 flex items-center justify-center">
                  {printer.onSale && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 flex items-center">
                      <BadgePercent className="h-3 w-3 mr-1" /> Sale
                    </div>
                  )}
                  <img
                    src={getImageSrc(printer)}
                    alt={printer.name}
                    className="h-full max-h-28 object-contain"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "";
                      e.currentTarget.alt = "Image unavailable";
                      e.currentTarget.parentElement?.classList.add("img-error");
                    }}
                  />
                </div>
                <h3 className="font-semibold text-sm mb-1">{printer.name}</h3>
                <p className="text-xs text-gray-600 mb-2 line-clamp-3">{printer.description}</p>
                <p className="text-sm font-bold text-brand-blue">{formatPrice(printer)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Page */}
        <div className="call-to-action mt-8 py-10 text-center">
          <h2 className="text-xl font-bold text-brand-blue mb-4">Contact Us Today</h2>
          <p className="text-lg mb-4">
            For bulk pricing and expert advice on label printing solutions
          </p>
          <div className="contact-info mt-6">
            <p className="font-semibold">022 657 8662</p>
            <p className="text-brand-blue">sales@servicelabels.co.nz</p>
            <p>Christchurch, New Zealand</p>
          </div>
        </div>

        {/* Footer */}
        <div className="footer text-center text-xs text-gray-500 mt-8 pt-4 border-t">
          <p>Service Labels NZ | Insight AI Systems Limited | Christchurch, NZ</p>
        </div>

        {/* Print-only styles */}
        <style type="text/css" dangerouslySetInnerHTML={{
          __html: `
            @media print {
              body { margin: 0; padding: 0; }
              .pdf-container { width: 210mm; height: 297mm; page-break-after: always; }
              .call-to-action { page-break-before: always; }
              .img-error { background: #f1f1f1; position: relative; }
              .img-error:after { content: "Image unavailable"; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 12px; color: #888; }
            }
          `
        }} />
      </div>
    );
  }
);

PrinterCatalog.displayName = "PrinterCatalog";

export default PrinterCatalog;
