
import React, { useEffect } from "react";
import { Printer } from "@/types";
import PrinterCard from "./PrinterCard";

interface PrinterGridProps {
  printers: Printer[];
}

const PrinterGrid: React.FC<PrinterGridProps> = ({ printers }) => {
  useEffect(() => {
    console.log("Rendering printers:", printers);
    printers.forEach(printer => {
      console.log(`Printer: ${printer.name}, Image path: ${printer.imageUrl}`);
    });
  }, [printers]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {printers.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500">No printers available</p>
        </div>
      ) : (
        printers.map((printer) => (
          <PrinterCard key={printer.id} printer={printer} />
        ))
      )}
    </div>
  );
};

export default PrinterGrid;
