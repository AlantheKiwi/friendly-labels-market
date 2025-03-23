
import { useState } from "react";
import { Printer } from "@/types";

export const usePrinterState = (initialPrinters: Printer[]) => {
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

  // Filter printers based on search query
  const filteredPrinters = printerData.filter(printer => 
    printer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    printerData,
    setPrinterData,
    searchQuery,
    setSearchQuery,
    editedPrices,
    setEditedPrices,
    savingIds,
    setSavingIds,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isSuspendDialogOpen,
    setIsSuspendDialogOpen,
    suspendAll,
    setSuspendAll,
    selectedPrinter,
    setSelectedPrinter,
    filteredPrinters,
    isDeleting,
    setIsDeleting
  };
};
