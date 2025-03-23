import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { Printer } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const usePrinterDialogs = (
  printerData: Printer[],
  setPrinterData: React.Dispatch<React.SetStateAction<Printer[]>>,
  setIsAddDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsSuspendDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSuspendAll: React.Dispatch<React.SetStateAction<boolean>>,
  selectedPrinter: Printer | null,
  setSelectedPrinter: React.Dispatch<React.SetStateAction<Printer | null>>,
  isDeleting: boolean,
  setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>
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

  const handleDeletePrinter = (printer: Printer) => {
    setSelectedPrinter(printer);
    setIsDeleteDialogOpen(true);
  };

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
      setPrinterData(prev => 
        prev.map(p => {
          if (p.id === selectedPrinter.id) {
            return {
              ...p,
              suspended: true
            };
          }
          return p;
        })
      );
      
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
    setPrinterData(prev => 
      prev.map(p => {
        if (p.id === printer.id) {
          return {
            ...p,
            suspended: false
          };
        }
        return p;
      })
    );
    
    toast({
      title: "Suspension removed",
      description: `${printer.name} is now active again`,
    });
  };

  // Keep this function for compatibility, but it won't be used anymore
  const handleUndoSuspendAll = () => {
    setPrinterData(prev => 
      prev.map(printer => ({
        ...printer,
        suspended: false
      }))
    );
    
    toast({
      title: "All suspensions removed",
      description: "All printers are now active again",
    });
  };

  const confirmDeletePrinter = async () => {
    if (!selectedPrinter) return;
    
    setIsDeleting(true);
    
    try {
      // Permanent deletion from data
      setPrinterData(prev => prev.filter(p => p.id !== selectedPrinter.id));
      
      // In a real application with a database, you would delete the printer from the database here
      // For example, with Supabase:
      // await supabase.from('printers').delete().eq('id', selectedPrinter.id);
      
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

  return {
    handleAddPrinter,
    handleEditPrinter,
    handleDeletePrinter,
    handleSuspendPrinter,
    handleSuspendAllPrinters,
    confirmSuspendPrinter,
    handleUndoSuspend,
    handleUndoSuspendAll,
    confirmDeletePrinter,
    handleSavePrinter
  };
};
