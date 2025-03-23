
import { Printer } from "@/types";
import { useToast } from "@/components/ui/use-toast";

export const useAddEditPrinter = (
  printerData: Printer[],
  setPrinterData: React.Dispatch<React.SetStateAction<Printer[]>>,
  setIsAddDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedPrinter: React.Dispatch<React.SetStateAction<Printer | null>>
) => {
  const { toast } = useToast();

  const handleAddPrinter = () => {
    setSelectedPrinter(null);
    setIsAddDialogOpen(true);
  };

  const handleEditPrinter = (printer: Printer) => {
    setSelectedPrinter(printer);
    setIsEditDialogOpen(true);
  };

  const handleSavePrinter = (printer: Printer) => {
    if (printer.id) {
      // Edit existing printer
      const updatedPrinters = printerData.map(p => p.id === printer.id ? printer : p);
      setPrinterData(updatedPrinters);
      
      // Update localStorage
      localStorage.setItem('printers', JSON.stringify(updatedPrinters));
      
      setIsEditDialogOpen(false);
    } else {
      // Add new printer
      // Generate a new ID that's higher than any existing ID
      const highestId = printerData.reduce((max, p) => Math.max(max, p.id), 0);
      const newPrinter = {
        ...printer,
        id: highestId + 1
      };
      
      const updatedPrinters = [...printerData, newPrinter].sort((a, b) => a.id - b.id);
      setPrinterData(updatedPrinters);
      
      // Update localStorage
      localStorage.setItem('printers', JSON.stringify(updatedPrinters));
      
      setIsAddDialogOpen(false);
    }
  };

  return {
    handleAddPrinter,
    handleEditPrinter,
    handleSavePrinter
  };
};
