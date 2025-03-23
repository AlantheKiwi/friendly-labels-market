
import { useState, useEffect } from "react";
import { Printer } from "@/types";

export const defaultPrinter: Printer = {
  id: 0,
  name: "",
  description: "",
  price: 0,
  gstIncluded: false,
  imageUrl: "https://www.accuratelabels.co.nz/wp-content/uploads/2022/08/placeholder-300x300.png",
  originalUrl: "",
  contactForPrice: false
};

export const usePrinterFormState = (printer?: Printer) => {
  const [formData, setFormData] = useState<Printer>({ ...defaultPrinter });

  // Initialize form data when printer prop changes
  useEffect(() => {
    if (printer) {
      setFormData({ ...printer });
    } else {
      setFormData({ ...defaultPrinter });
    }
  }, [printer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>) => {
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
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked
    }));
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleCheckboxChange
  };
};
