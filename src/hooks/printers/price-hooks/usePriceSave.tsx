
import { useState } from "react";
import { Printer } from "@/types";

export const usePriceSave = (
  printerData: Printer[],
  setPrinterData: React.Dispatch<React.SetStateAction<Printer[]>>,
  editedPrices: Record<number, { price: number }>,
  setEditedPrices: React.Dispatch<React.SetStateAction<Record<number, { price: number }>>>,
  savingIds: number[],
  setSavingIds: React.Dispatch<React.SetStateAction<number[]>>
) => {
  const handleSavePrice = async (printerId: number) => {
    // Check if price is edited
    if (!editedPrices[printerId]) return;

    // Start loading state
    setSavingIds((prev) => [...prev, printerId]);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update printer data
      setPrinterData((prev) =>
        prev.map((printer) => {
          if (printer.id === printerId) {
            return {
              ...printer,
              price: editedPrices[printerId].price,
            };
          }
          return printer;
        })
      );

      // Save updated printers to localStorage
      const updatedPrinters = printerData.map((printer) => {
        if (printer.id === printerId) {
          return {
            ...printer,
            price: editedPrices[printerId].price,
          };
        }
        return printer;
      });
      localStorage.setItem('printers', JSON.stringify(updatedPrinters));

      // Clear edited price after successful save
      setEditedPrices((prev) => {
        const newState = { ...prev };
        delete newState[printerId];
        return newState;
      });
    } catch (error) {
      console.error("Error saving price:", error);
    } finally {
      // End loading state
      setSavingIds((prev) => prev.filter((id) => id !== printerId));
    }
  };

  return {
    handleSavePrice
  };
};
