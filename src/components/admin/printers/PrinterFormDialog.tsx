
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { usePrinterFormState } from "./form-components/usePrinterFormState";
import { usePrinterFormValidation } from "./form-components/usePrinterFormValidation";
import PrinterFormFields from "./form-components/PrinterFormFields";

interface PrinterFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (printer: Printer) => void;
  printer?: Printer; // If provided, we're editing an existing printer
}

const PrinterFormDialog: React.FC<PrinterFormDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  printer
}) => {
  const { formData, handleChange, handleCheckboxChange } = usePrinterFormState(printer);
  const { errors, setErrors, validateForm } = usePrinterFormValidation(formData);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // If creating a new printer, generate a new ID
      if (!printer) {
        // Find the highest ID and increment by 1
        const highestId = Math.max(...(formData.id ? [formData.id] : [0]));
        formData.id = highestId + 1;
      }
      
      onSave(formData);
      toast({
        title: printer ? "Printer Updated" : "Printer Added",
        description: `${formData.name} has been ${printer ? "updated" : "added"} successfully.`
      });
    } else {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive"
      });
    }
  };

  // Create a wrapped handleChange that also handles clearing errors
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleChange(e, setErrors);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{printer ? "Edit Printer" : "Add New Printer"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <PrinterFormFields 
            formData={formData}
            errors={errors}
            handleChange={handleFieldChange}
            handleCheckboxChange={handleCheckboxChange}
          />
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {printer ? "Update Printer" : "Add Printer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PrinterFormDialog;
