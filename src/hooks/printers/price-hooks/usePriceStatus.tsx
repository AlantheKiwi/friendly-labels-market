
import { Printer } from "@/types";

export const usePriceStatus = (
  editedPrices: Record<number, { price: number }>,
  savingIds: number[]
) => {
  const isPriceEdited = (printerId: number) => {
    return Boolean(editedPrices[printerId]);
  };

  const isSaving = (printerId: number) => {
    return savingIds.includes(printerId);
  };

  return {
    isPriceEdited,
    isSaving
  };
};
