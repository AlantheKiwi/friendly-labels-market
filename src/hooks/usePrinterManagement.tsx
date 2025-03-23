
import { useState } from "react";
import { Printer } from "@/types";
import { useToast } from "@/components/ui/use-toast";

export const usePrinterManagement = (initialPrinters: Printer[]) => {
  const [printerData, setPrinterData] = useState<Printer[]>(initialPrinters);
  const [searchQuery, setSearchQuery] = useState("");
  const [editedPrices, setEditedPrices] = useState<Record<number, { price: number }>>({});
  const [savingIds, setSavingIds] = useState<number[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPrinter, setSelectedPrinter] = useState<Printer | null>(null);
  const { toast } = useToast();

  // Filter printers based on search query
  const filteredPrinters = printerData.filter(printer => 
    printer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePriceChange = (printerId: number, value: string) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue) && value !== "") return;
    
    setEditedPrices(prev => {
      const currentEdits = prev[printerId] || { 
        price: printerData.find(p => p.id === printerId)?.price || 0
      };
      
      return {
        ...prev,
        [printerId]: {
          ...currentEdits,
          price: value === "" ? 0 : numericValue
        }
      };
    });
  };

  const handleSavePrice = (printerId: number) => {
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
    const originalPrinter = initialPrinters.find(p => p.id === printerId);
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

  const handleAddPrinter = () => {
    setSelectedPrinter(null);
    setIsAddDialogOpen(true);
  };

  const handleEditPrinter = (printer: Printer) => {
    setSelectedPrinter(printer);
    setIsEditDialogOpen(true);
  };

  const handleDeletePrinter = (printer: Printer) => {
    setSelectedPrinter(printer);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeletePrinter = () => {
    if (!selectedPrinter) return;
    
    setPrinterData(prev => prev.filter(p => p.id !== selectedPrinter.id));
    
    toast({
      title: "Printer deleted",
      description: `${selectedPrinter.name} has been removed`,
      action: (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleUndoDelete(selectedPrinter)}
          className="gap-1"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          Undo
        </Button>
      ),
    });
    
    setIsDeleteDialogOpen(false);
  };

  const handleUndoDelete = (printer: Printer) => {
    setPrinterData(prev => [...prev, printer].sort((a, b) => a.id - b.id));
    
    toast({
      title: "Deletion undone",
      description: `${printer.name} has been restored`,
    });
  };

  const handleSavePrinter = (printer: Printer) => {
    if (selectedPrinter) {
      // Edit existing printer
      setPrinterData(prev => 
        prev.map(p => p.id === printer.id ? printer : p)
      );
      setIsEditDialogOpen(false);
    } else {
      // Add new printer
      setPrinterData(prev => [...prev, printer].sort((a, b) => a.id - b.id));
      setIsAddDialogOpen(false);
    }
  };

  const isPriceEdited = (printerId: number) => {
    return !!editedPrices[printerId];
  };

  const isSaving = (printerId: number) => {
    return savingIds.includes(printerId);
  };

  return {
    printerData,
    searchQuery,
    setSearchQuery,
    editedPrices,
    savingIds,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedPrinter,
    filteredPrinters,
    handlePriceChange,
    handleSavePrice,
    handleAddPrinter,
    handleEditPrinter,
    handleDeletePrinter,
    confirmDeletePrinter,
    handleSavePrinter,
    isPriceEdited,
    isSaving
  };
};

import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
