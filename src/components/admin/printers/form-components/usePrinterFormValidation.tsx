
import { useState } from "react";
import { Printer } from "@/types";

export const usePrinterFormValidation = (formData: Printer) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
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

  return {
    errors,
    setErrors,
    validateForm
  };
};
