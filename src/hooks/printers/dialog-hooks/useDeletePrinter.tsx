
import { Printer } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export const useDeletePrinter = (
  printerData: Printer[],
  setPrinterData: React.Dispatch<React.SetStateAction<Printer[]>>,
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  selectedPrinter: Printer | null,
  setSelectedPrinter: React.Dispatch<React.SetStateAction<Printer | null>>
) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDeletePrinter = (printer: Printer) => {
    setSelectedPrinter(printer);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeletePrinter = async () => {
    if (!selectedPrinter) return;
    
    setIsDeleting(true);
    
    try {
      // Remove from local state
      const updatedPrinters = printerData.filter(p => p.id !== selectedPrinter.id);
      setPrinterData(updatedPrinters);
      
      // Store in localStorage - this is the key change to ensure deletions persist
      localStorage.setItem('printers', JSON.stringify(updatedPrinters));
      
      toast({
        title: "Printer deleted permanently",
        description: `${selectedPrinter.name} has been permanently removed from the system`,
      });
    } catch (error) {
      console.error("Error deleting printer:", error);
      toast({
        title: "Error deleting printer",
        description: "There was an error deleting the printer. Please try again.",
        variant: "destructive"
      });
      
      // Restore the printer in the UI if deletion failed
      setPrinterData(prev => [...prev, selectedPrinter]);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return {
    handleDeletePrinter,
    confirmDeletePrinter,
    isDeleting,
    setIsDeleting
  };
};
