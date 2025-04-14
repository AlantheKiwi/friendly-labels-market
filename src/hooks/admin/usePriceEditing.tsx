
import { useState } from "react";
import { Product } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { productList } from "@/data/products/index";

export const usePriceEditing = (
  products: Product[],
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
) => {
  const [editedPrices, setEditedPrices] = useState<Record<string, Record<string, Record<string, { price: number }>>>>({}); // product->size->quantity
  const [savingIds, setSavingIds] = useState<string[]>([]);
  const { toast } = useToast();

  const handlePriceChange = (productId: string, sizeId: string, quantityId: string, value: string) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue) && value !== "") return;
    
    setEditedPrices(prev => {
      const productEdits = prev[productId] || {};
      const sizeEdits = productEdits[sizeId] || {};
      const quantityEdits = sizeEdits[quantityId] || { 
        price: 0
      };
      
      return {
        ...prev,
        [productId]: {
          ...productEdits,
          [sizeId]: {
            ...sizeEdits,
            [quantityId]: {
              price: value === "" ? 0 : numericValue
            }
          }
        }
      };
    });
  };

  const handleSave = (productId: string, sizeId: string, quantityId: string) => {
    const savingId = `${productId}-${sizeId}-${quantityId}`;
    setSavingIds(prev => [...prev, savingId]);
    
    // Simulate saving to backend
    setTimeout(() => {
      setProducts(prev => 
        prev.map(product => {
          if (product.id === productId) {
            return {
              ...product,
              quantities: product.quantities.map(qty => {
                if (qty.id === quantityId && editedPrices[productId]?.[sizeId]?.[quantityId]) {
                  const { price } = editedPrices[productId][sizeId][quantityId];
                  
                  return {
                    ...qty,
                    price,
                    basePrice: price,
                    discountPercent: 0
                  };
                }
                return qty;
              })
            };
          }
          return product;
        })
      );
      
      // Remove from editing state
      setEditedPrices(prev => {
        const newState = { ...prev };
        if (newState[productId] && newState[productId][sizeId]) {
          const sizeState = { ...newState[productId][sizeId] };
          delete sizeState[quantityId];
          
          if (Object.keys(sizeState).length === 0) {
            const productState = { ...newState[productId] };
            delete productState[sizeId];
            
            if (Object.keys(productState).length === 0) {
              delete newState[productId];
            } else {
              newState[productId] = productState;
            }
          } else {
            newState[productId][sizeId] = sizeState;
          }
        }
        return newState;
      });
      
      setSavingIds(prev => prev.filter(id => id !== savingId));
      
      // Show success toast with undo option
      toast({
        title: "Price updated",
        description: "Product price has been updated successfully",
        action: (
          <span>
            <button
              className="bg-transparent border-none underline cursor-pointer"
              onClick={() => handleRevertPrice(productId, sizeId, quantityId)}
            >
              Undo
            </button>
          </span>
        ),
      });
    }, 800);
  };

  const handleRevertPrice = (productId: string, sizeId: string, quantityId: string) => {
    // In a real app, you'd fetch the original value from the server
    // For demonstration, we'll use the initial data
    const originalProduct = productList.find(p => p.id === productId);
    if (!originalProduct) return;
    
    const originalQuantity = originalProduct.quantities.find(q => q.id === quantityId);
    if (!originalQuantity) return;
    
    setProducts(prev => 
      prev.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            quantities: product.quantities.map(qty => 
              qty.id === quantityId ? { ...originalQuantity } : qty
            )
          };
        }
        return product;
      })
    );
    
    toast({
      title: "Price reverted",
      description: "The price change has been undone",
    });
  };

  const handleSaveSize = (productId: string, sizeId: string, name: string, dimensions: string) => {
    // In a real app, this would update the size in the database
    setProducts(prev => 
      prev.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            sizes: product.sizes.map(size => 
              size.id === sizeId ? { ...size, name, dimensions } : size
            )
          };
        }
        return product;
      })
    );

    toast({
      title: "Size updated",
      description: `Size "${name}" has been updated successfully`,
    });
  };

  const handleToggleSizeStatus = (productId: string, sizeId: string, suspended: boolean) => {
    // In a real app, this would update the size status in the database
    // For this demo, we'll just show a toast
    
    toast({
      title: suspended ? "Size suspended" : "Size activated",
      description: `Size has been ${suspended ? "suspended" : "activated"} successfully`,
    });
  };

  const handleSaveQuantity = (productId: string, sizeId: string, quantityId: string, amount: number) => {
    // In a real app, this would update the quantity in the database
    setProducts(prev => 
      prev.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            quantities: product.quantities.map(qty => 
              qty.id === quantityId ? { ...qty, amount } : qty
            )
          };
        }
        return product;
      })
    );

    toast({
      title: "Quantity updated",
      description: `Quantity value updated to ${amount} units`,
    });
  };

  const isPriceEdited = (productId: string, sizeId: string, quantityId: string) => {
    return !!editedPrices[productId]?.[sizeId]?.[quantityId];
  };

  const isSaving = (productId: string, sizeId: string, quantityId: string) => {
    return savingIds.includes(`${productId}-${sizeId}-${quantityId}`);
  };

  return {
    editedPrices,
    savingIds,
    handlePriceChange,
    handleSave,
    isPriceEdited,
    isSaving,
    handleRevertPrice,
    handleSaveSize,
    handleToggleSizeStatus,
    handleSaveQuantity
  };
};
