
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "@/types";
import { AlertTriangle } from "lucide-react";

interface SuspendPrinterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  printer: Printer | null;
  suspendAll: boolean;
}

const SuspendPrinterDialog: React.FC<SuspendPrinterDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  printer,
  suspendAll,
}) => {
  const title = suspendAll ? "Suspend All Printers" : "Suspend Printer";
  const description = suspendAll
    ? "Are you sure you want to suspend all printers? This will make them unavailable for customers."
    : `Are you sure you want to suspend ${printer?.name}? This will make the printer unavailable for customers.`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2 text-yellow-600">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="default" onClick={onConfirm} className="bg-yellow-600 hover:bg-yellow-700">
            Suspend
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuspendPrinterDialog;
