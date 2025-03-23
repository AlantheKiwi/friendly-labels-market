
import React from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Printer } from "@/types";

interface DeletePrinterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  printer: Printer | null;
}

const DeletePrinterDialog: React.FC<DeletePrinterDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  printer
}) => {
  if (!printer) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Printer</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{printer.name}</strong>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePrinterDialog;
