
import { useState } from "react";
import { Printer } from "@/types";

export const usePriceChange = (
  setEditedPrices: React.Dispatch<React.SetStateAction<Record<number, { price: number }>>>
) => {
  const handlePriceChange = (printerId: number, value: string) => {
    const newPrice = parseFloat(value);
    if (!isNaN(newPrice)) {
      setEditedPrices((prev) => ({
        ...prev,
        [printerId]: { price: newPrice },
      }));
    }
  };

  return {
    handlePriceChange
  };
};
