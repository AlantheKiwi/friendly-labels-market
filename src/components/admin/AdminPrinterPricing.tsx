
import React, { useState, useEffect } from "react";
import { printers } from "@/data/printerData";
import { Printer as PrinterType } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Search, Save, Check, RefreshCcw } from "lucide-react";

const AdminPrinterPricing = () => {
  const [printerData, setPrinterData] = useState<PrinterType[]>(printers);
  const [searchQuery, setSearchQuery] = useState("");
  const [editedPrices, setEditedPrices] = useState<Record<number, { price: number; originalPrice?: number }>>({});
  const [savingIds, setSavingIds] = useState<number[]>([]);
  const { toast } = useToast();

  // Filter printers based on search query
  const filteredPrinters = printerData.filter(printer => 
    printer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePriceChange = (printerId: number, field: 'price' | 'originalPrice', value: string) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue) && value !== "") return;
    
    setEditedPrices(prev => {
      const currentEdits = prev[printerId] || { 
        price: printerData.find(p => p.id === printerId)?.price || 0,
        originalPrice: printerData.find(p => p.id === printerId)?.originalPrice
      };
      
      return {
        ...prev,
        [printerId]: {
          ...currentEdits,
          [field]: value === "" ? 0 : numericValue
        }
      };
    });
  };

  const handleSave = (printerId: number) => {
    setSavingIds(prev => [...prev, printerId]);
    
    // Simulate saving to backend
    setTimeout(() => {
      setPrinterData(prev => 
        prev.map(printer => {
          if (printer.id === printerId) {
            const updatedPrinter = { ...printer };
            if (editedPrices[printerId]) {
              if (editedPrices[printerId].price !== undefined) {
                updatedPrinter.price = editedPrices[printerId].price;
              }
              if (editedPrices[printerId].originalPrice !== undefined) {
                updatedPrinter.originalPrice = editedPrices[printerId].originalPrice;
              }
            }
            return updatedPrinter;
          }
          return printer;
        })
      );
      
      // Remove from editing state
      setEditedPrices(prev => {
        const newState = { ...prev };
        delete newState[printerId];
        return newState;
      });
      
      setSavingIds(prev => prev.filter(id => id !== printerId));
      
      // Show success toast with undo option
      toast({
        title: "Price updated",
        description: "Printer price has been updated successfully",
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRevertPrice(printerId)}
            className="gap-1"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            Undo
          </Button>
        ),
      });
    }, 800);
  };

  const handleRevertPrice = (printerId: number) => {
    // In a real app, you'd fetch the original value from the server
    // For demonstration, we'll use the initial data
    const originalPrinter = printers.find(p => p.id === printerId);
    if (!originalPrinter) return;
    
    setPrinterData(prev => 
      prev.map(printer => 
        printer.id === printerId ? { ...originalPrinter } : printer
      )
    );
    
    toast({
      title: "Price reverted",
      description: "The price change has been undone",
    });
  };

  const isPriceEdited = (printerId: number) => {
    return !!editedPrices[printerId];
  };

  const isSaving = (printerId: number) => {
    return savingIds.includes(printerId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search printers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">ID</TableHead>
              <TableHead>Printer Name</TableHead>
              <TableHead className="w-40">Price (NZD)</TableHead>
              <TableHead className="w-40">Original Price</TableHead>
              <TableHead className="w-32">Status</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPrinters.length > 0 ? (
              filteredPrinters.map((printer) => (
                <TableRow key={printer.id}>
                  <TableCell className="font-medium">{printer.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">{printer.name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {printer.description.substring(0, 50)}...
                    </div>
                  </TableCell>
                  <TableCell>
                    {printer.contactForPrice ? (
                      <Badge variant="outline">Contact for Price</Badge>
                    ) : (
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={
                          editedPrices[printer.id]?.price !== undefined
                            ? editedPrices[printer.id].price
                            : printer.price
                        }
                        onChange={(e) => 
                          handlePriceChange(printer.id, 'price', e.target.value)
                        }
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {printer.onSale ? (
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={
                          editedPrices[printer.id]?.originalPrice !== undefined
                            ? editedPrices[printer.id].originalPrice
                            : printer.originalPrice || 0
                        }
                        onChange={(e) => 
                          handlePriceChange(printer.id, 'originalPrice', e.target.value)
                        }
                      />
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {printer.onSale && (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                        On Sale
                      </Badge>
                    )}
                    {printer.contactForPrice && (
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                        Contact Only
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => handleSave(printer.id)}
                      disabled={!isPriceEdited(printer.id) || isSaving(printer.id) || printer.contactForPrice}
                    >
                      {isSaving(printer.id) ? (
                        <span className="h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-1"></span>
                      ) : isPriceEdited(printer.id) ? (
                        <Save className="h-3.5 w-3.5 mr-1" />
                      ) : (
                        <Check className="h-3.5 w-3.5 mr-1" />
                      )}
                      {isSaving(printer.id)
                        ? "Saving"
                        : isPriceEdited(printer.id)
                        ? "Save"
                        : "Saved"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-gray-500">
                  No printers found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminPrinterPricing;
