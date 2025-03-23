
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { Printer } from "@/types";

export const usePriceActions = (
  printerData: Printer[],
  setPrinterData: React.Dispatch<React.SetStateAction<Printer[]>>,
  editedPrices: Record<number, { price: number }>,
  setEditedPrices: React.Dispatch<React.SetStateAction<Record<number, { price: number }>>>,
  savingIds: number[],
  setSavingIds: React.Dispatch<React.SetStateAction<number[]>>,
  initialPrinters: Printer[]
) => {
  const { toast } = useToast();

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

  const isPriceEdited = (printerId: number) => {
    return !!editedPrices[printerId];
  };

  const isSaving = (printerId: number) => {
    return savingIds.includes(printerId);
  };

  return {
    handlePriceChange,
    handleSavePrice,
    handleRevertPrice,
    isPriceEdited,
    isSaving
  };
};
