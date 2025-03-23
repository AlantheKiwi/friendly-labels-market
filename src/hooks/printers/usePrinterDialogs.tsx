
import { Printer } from "@/types";
import { useAddEditPrinter } from "./dialog-hooks/useAddEditPrinter";
import { useDeletePrinter } from "./dialog-hooks/useDeletePrinter";
import { useSuspendPrinter } from "./dialog-hooks/useSuspendPrinter";

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
  // Hook for add/edit printer operations
  const {
    handleAddPrinter,
    handleEditPrinter,
    handleSavePrinter
  } = useAddEditPrinter(
    printerData,
    setPrinterData,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setSelectedPrinter
  );

  // Hook for delete printer operations
  const {
    handleDeletePrinter,
    confirmDeletePrinter
  } = useDeletePrinter(
    printerData,
    setPrinterData,
    setIsDeleteDialogOpen,
    selectedPrinter,
    setSelectedPrinter
  );

  // Hook for suspend printer operations
  const {
    handleSuspendPrinter,
    handleSuspendAllPrinters,
    confirmSuspendPrinter,
    handleUndoSuspend,
    handleUndoSuspendAll
  } = useSuspendPrinter(
    printerData,
    setPrinterData,
    setIsSuspendDialogOpen,
    setSuspendAll,
    selectedPrinter,
    setSelectedPrinter
  );

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
