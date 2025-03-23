
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";

interface PrinterHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAddPrinter: () => void;
}

const PrinterHeader: React.FC<PrinterHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onAddPrinter,
}) => {
  return (
    <div className="flex items-center justify-between space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search printers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      <Button onClick={onAddPrinter} className="flex items-center gap-1">
        <Plus className="h-4 w-4" />
        Add Printer
      </Button>
    </div>
  );
};

export default PrinterHeader;
