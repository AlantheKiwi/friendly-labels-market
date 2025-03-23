
import React from "react";
import { printers as initialPrinters } from "@/data/printerData";
import PrinterFormDialog from "./printers/PrinterFormDialog";
import DeletePrinterDialog from "./printers/DeletePrinterDialog";
import SuspendPrinterDialog from "./printers/SuspendPrinterDialog";
import PrinterHeader from "./printers/PrinterHeader";
import PrinterTable from "./printers/PrinterTable";
import { usePrinterManagement } from "@/hooks/usePrinterManagement";

const AdminPrinterPricing = () => {
  const {
    searchQuery,
    setSearchQuery,
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
    editedPrices,
    savingIds,
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
  } = usePrinterManagement(initialPrinters);

  return (
    <div className="space-y-6">
      <PrinterHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAddPrinter={handleAddPrinter}
      />
      
      <PrinterTable 
        filteredPrinters={filteredPrinters}
        editedPrices={editedPrices}
        savingIds={savingIds}
        handlePriceChange={handlePriceChange}
        handleSavePrice={handleSavePrice}
        handleEditPrinter={handleEditPrinter}
        handleDeletePrinter={handleDeletePrinter}
        handleSuspendPrinter={handleSuspendPrinter}
        handleSuspendAllPrinters={handleSuspendAllPrinters}
        isPriceEdited={isPriceEdited}
        isSaving={isSaving}
      />

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

      {/* Suspend Confirmation Dialog */}
      <SuspendPrinterDialog
        isOpen={isSuspendDialogOpen}
        onClose={() => setIsSuspendDialogOpen(false)}
        onConfirm={confirmSuspendPrinter}
        printer={selectedPrinter}
        suspendAll={suspendAll}
      />
    </div>
  );
};

export default AdminPrinterPricing;
