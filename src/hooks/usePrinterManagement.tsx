
import { Printer } from "@/types";
import { usePrinterState } from "./printers/usePrinterState";
import { usePriceActions } from "./printers/usePriceActions";
import { usePrinterDialogs } from "./printers/usePrinterDialogs";

export const usePrinterManagement = (initialPrinters: Printer[]) => {
  const {
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
  } = usePrinterState(initialPrinters);

  const {
    handlePriceChange,
    handleSavePrice,
    isPriceEdited,
    isSaving
  } = usePriceActions(
    printerData,
    setPrinterData,
    editedPrices,
    setEditedPrices,
    savingIds,
    setSavingIds,
    initialPrinters
  );

  const {
    handleAddPrinter,
    handleEditPrinter,
    handleDeletePrinter,
    handleSuspendPrinter,
    handleSuspendAllPrinters,
    confirmSuspendPrinter,
    confirmDeletePrinter,
    handleSavePrinter
  } = usePrinterDialogs(
    printerData,
    setPrinterData,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    setIsSuspendDialogOpen,
    setSuspendAll,
    selectedPrinter,
    setSelectedPrinter,
    isDeleting,
    setIsDeleting
  );

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
