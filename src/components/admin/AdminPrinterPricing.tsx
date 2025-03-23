
import React, { useState, useEffect } from "react";
import { printers as initialPrinters } from "@/data/printerData";
import { Printer as PrinterType } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Search, Plus, Pencil, Trash2, Save, Check, RefreshCcw } from "lucide-react";
import PrinterFormDialog from "./printers/PrinterFormDialog";
import DeletePrinterDialog from "./printers/DeletePrinterDialog";

const AdminPrinterPricing = () => {
  const [printerData, setPrinterData] = useState<PrinterType[]>(initialPrinters);
  const [searchQuery, setSearchQuery] = useState("");
  const [editedPrices, setEditedPrices] = useState<Record<number, { price: number }>>({});
  const [savingIds, setSavingIds] = useState<number[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPrinter, setSelectedPrinter] = useState<PrinterType | null>(null);
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

  const handleEditPrinter = (printer: PrinterType) => {
    setSelectedPrinter(printer);
    setIsEditDialogOpen(true);
  };

  const handleDeletePrinter = (printer: PrinterType) => {
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

  const handleUndoDelete = (printer: PrinterType) => {
    setPrinterData(prev => [...prev, printer].sort((a, b) => a.id - b.id));
    
    toast({
      title: "Deletion undone",
      description: `${printer.name} has been restored`,
    });
  };

  const handleSavePrinter = (printer: PrinterType) => {
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

  return (
    <div className="space-y-6">
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
        <Button onClick={handleAddPrinter} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Add Printer
        </Button>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">ID</TableHead>
              <TableHead>Printer Name</TableHead>
              <TableHead className="w-40">Price (NZD)</TableHead>
              <TableHead className="w-32">Status</TableHead>
              <TableHead className="w-40">Actions</TableHead>
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
                          handlePriceChange(printer.id, e.target.value)
                        }
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {printer.contactForPrice && (
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                        Contact Only
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleSavePrice(printer.id)}
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
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditPrinter(printer)}
                      >
                        <Pencil className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                        onClick={() => handleDeletePrinter(printer)}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-gray-500">
                  No printers found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Printer Dialog */}
      <PrinterFormDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleSavePrinter}
      />

      {/* Edit Printer Dialog */}
      <PrinterFormDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleSavePrinter}
        printer={selectedPrinter || undefined}
      />

      {/* Delete Confirmation Dialog */}
      <DeletePrinterDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeletePrinter}
        printer={selectedPrinter}
      />
    </div>
  );
};

export default AdminPrinterPricing;
