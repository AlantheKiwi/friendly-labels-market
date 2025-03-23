import { useState } from "react";
import { Printer } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const usePrinterManagement = (initialPrinters: Printer[]) => {
  const [printerData, setPrinterData] = useState<Printer[]>(
    initialPrinters.map(printer => ({
      ...printer,
      suspended: printer.suspended || false
    }))
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [editedPrices, setEditedPrices] = useState<Record<number, { price: number }>>({});
  const [savingIds, setSavingIds] = useState<number[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
  const [suspendAll, setSuspendAll] = useState(false);
  const [selectedPrinter, setSelectedPrinter] = useState<Printer | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
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
    isSuspendDialogOpen,
    setIsSuspendDialogOpen,
    suspendAll,
    selectedPrinter,
    filteredPrinters,
    isDeleting,
    handlePriceChange,
    handleSavePrice,
    handleAddPrinter,
    handleEditPrinter,
    handleDeletePrinter,
    handleSuspendPrinter,
    handleSuspendAllPrinters,
    confirmDeletePrinter,
    confirmSuspendPrinter,
    handleSavePrinter,
    isPriceEdited,
    isSaving
  };
};
