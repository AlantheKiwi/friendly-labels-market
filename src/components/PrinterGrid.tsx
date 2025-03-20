
import React from "react";
import { Printer } from "@/types";
import PrinterCard from "./PrinterCard";

interface PrinterGridProps {
  printers: Printer[];
}

const PrinterGrid: React.FC<PrinterGridProps> = ({ printers }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {printers.map((printer) => (
        <PrinterCard key={printer.id} printer={printer} />
      ))}
    </div>
  );
};

export default PrinterGrid;
