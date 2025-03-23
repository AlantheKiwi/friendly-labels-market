
import React from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Printer } from "@/types";
import { Loader2 } from "lucide-react";

interface DeletePrinterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  printer: Printer | null;
  isDeleting: boolean;
}

const DeletePrinterDialog: React.FC<DeletePrinterDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  printer,
  isDeleting
}) => {
  if (!printer) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Printer</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to permanently delete <strong>{printer.name}</strong>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            className="bg-red-600 hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Permanently'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePrinterDialog;
