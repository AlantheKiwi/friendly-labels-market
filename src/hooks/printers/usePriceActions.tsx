
import { Printer } from "@/types";
import { usePriceChange } from "./price-hooks/usePriceChange";
import { usePriceSave } from "./price-hooks/usePriceSave";
import { usePriceStatus } from "./price-hooks/usePriceStatus";

export const usePriceActions = (
  printerData: Printer[],
  setPrinterData: React.Dispatch<React.SetStateAction<Printer[]>>,
  editedPrices: Record<number, { price: number }>,
  setEditedPrices: React.Dispatch<React.SetStateAction<Record<number, { price: number }>>>,
  savingIds: number[],
  setSavingIds: React.Dispatch<React.SetStateAction<number[]>>,
  initialPrinters: Printer[]
) => {
  // Hook for handling price changes
  const { handlePriceChange } = usePriceChange(setEditedPrices);

  // Hook for saving prices
  const { handleSavePrice } = usePriceSave(
    printerData,
    setPrinterData,
    editedPrices,
    setEditedPrices,
    savingIds,
    setSavingIds
  );

  // Hook for checking price status
  const { isPriceEdited, isSaving } = usePriceStatus(editedPrices, savingIds);

  return {
    handlePriceChange,
    handleSavePrice,
    isPriceEdited,
    isSaving,
  };
};
