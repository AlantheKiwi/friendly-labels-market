import { Printer } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export const useSuspendPrinter = (
  printerData: Printer[],
  setPrinterData: React.Dispatch<React.SetStateAction<Printer[]>>,
  setIsSuspendDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSuspendAll: React.Dispatch<React.SetStateAction<boolean>>,
  selectedPrinter: Printer | null,
  setSelectedPrinter: React.Dispatch<React.SetStateAction<Printer | null>>
) => {
  const { toast } = useToast();

  const handleSuspendPrinter = (printer: Printer) => {
    setSelectedPrinter(printer);
    setIsSuspendDialogOpen(true);
    setSuspendAll(false);
  };

  // Keep this function for compatibility, but it won't be used anymore
  const handleSuspendAllPrinters = () => {
    setSelectedPrinter(null);
    setIsSuspendDialogOpen(true);
    setSuspendAll(true);
  };

  const confirmSuspendPrinter = () => {
    if (selectedPrinter) {
      // Suspend single printer
      const updatedPrinters = printerData.map(p => {
        if (p.id === selectedPrinter.id) {
          return {
            ...p,
            suspended: true
          };
        }
        return p;
      });
      
      setPrinterData(updatedPrinters);
      
      // Save to localStorage
      localStorage.setItem('printers', JSON.stringify(updatedPrinters));
      
      toast({
        title: "Printer suspended",
        description: `${selectedPrinter.name} has been suspended`,
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleUndoSuspend(selectedPrinter)}
            className="gap-1"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            Undo
          </Button>
        ),
      });
    }
    
    setIsSuspendDialogOpen(false);
  };

  const handleUndoSuspend = (printer: Printer) => {
    const updatedPrinters = printerData.map(p => {
      if (p.id === printer.id) {
        return {
          ...p,
          suspended: false
        };
      }
      return p;
    });
    
    setPrinterData(updatedPrinters);
    
    // Save to localStorage
    localStorage.setItem('printers', JSON.stringify(updatedPrinters));
    
    toast({
      title: "Suspension removed",
      description: `${printer.name} is now active again`,
    });
  };

  // Keep this function for compatibility, but it won't be used anymore
  const handleUndoSuspendAll = () => {
    const updatedPrinters = printerData.map(printer => ({
      ...printer,
      suspended: false
    }));
    
    setPrinterData(updatedPrinters);
    
    // Save to localStorage
    localStorage.setItem('printers', JSON.stringify(updatedPrinters));
    
    toast({
      title: "All suspensions removed",
      description: "All printers are now active again",
    });
  };

  return {
    handleSuspendPrinter,
    handleSuspendAllPrinters,
    confirmSuspendPrinter,
    handleUndoSuspend,
    handleUndoSuspendAll
  };
};
