
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Printer } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface PrinterFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (printer: Printer) => void;
  printer?: Printer; // If provided, we're editing an existing printer
}

const defaultPrinter: Printer = {
  id: 0,
  name: "",
  description: "",
  price: 0,
  gstIncluded: false,
  imageUrl: "https://www.accuratelabels.co.nz/wp-content/uploads/2022/08/placeholder-300x300.png",
  originalUrl: "",
  contactForPrice: false
};

const PrinterFormDialog: React.FC<PrinterFormDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  printer
}) => {
  const [formData, setFormData] = useState<Printer>({ ...defaultPrinter });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Initialize form data when printer prop changes
  useEffect(() => {
    if (printer) {
      setFormData({ ...printer });
    } else {
      setFormData({ ...defaultPrinter });
    }
  }, [printer, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let parsedValue: any = value;

    // Parse numeric values
    if (name === "price" && value !== "") {
      parsedValue = parseFloat(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue
    }));

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Printer name is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.contactForPrice && (isNaN(formData.price) || formData.price < 0)) {
      newErrors.price = "Price must be a valid number greater than or equal to 0";
    }
    
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = "Image URL is required";
    }
    
    if (!formData.originalUrl.trim()) {
      newErrors.originalUrl = "Original URL is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{printer ? "Edit Printer" : "Add New Printer"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Printer Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="contactForPrice"
                checked={formData.contactForPrice || false}
                onCheckedChange={(checked) => handleCheckboxChange("contactForPrice", checked as boolean)}
              />
              <Label htmlFor="contactForPrice">Contact for Price (hide price field)</Label>
            </div>
            
            {!formData.contactForPrice && (
              <div className="space-y-2">
                <Label htmlFor="price">Price (NZD)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className={errors.price ? "border-red-500" : ""}
                />
                {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="gstIncluded"
                checked={formData.gstIncluded}
                onCheckedChange={(checked) => handleCheckboxChange("gstIncluded", checked as boolean)}
              />
              <Label htmlFor="gstIncluded">GST Included</Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className={errors.imageUrl ? "border-red-500" : ""}
              />
              {errors.imageUrl && <p className="text-red-500 text-sm">{errors.imageUrl}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="originalUrl">Original URL</Label>
              <Input
                id="originalUrl"
                name="originalUrl"
                value={formData.originalUrl}
                onChange={handleChange}
                className={errors.originalUrl ? "border-red-500" : ""}
              />
              {errors.originalUrl && <p className="text-red-500 text-sm">{errors.originalUrl}</p>}
            </div>
          </div>
          
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
