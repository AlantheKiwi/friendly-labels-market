
import React, { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Trash2, Save, Check, Layers, Edit, XCircle } from "lucide-react";
import { Product, ProductSize, ProductQuantity } from "@/types";

interface ProductPriceRowProps {
  product: Product;
  size: ProductSize;
  quantity: ProductQuantity;
  isFirstRow: boolean;
  isFirstSize: boolean;
  totalRows: number;
  handlePriceChange: (productId: string, sizeId: string, quantityId: string, value: string) => void;
  handleSave: (productId: string, sizeId: string, quantityId: string) => void;
  isPriceEdited: (productId: string, sizeId: string, quantityId: string) => boolean;
  isSaving: (productId: string, sizeId: string, quantityId: string) => boolean;
  onToggleSuspend: (product: Product) => void;
  onDeleteClick: (product: Product) => void;
}

const ProductPriceRow: React.FC<ProductPriceRowProps> = ({
  product,
  size,
  quantity,
  isFirstRow,
  isFirstSize,
  totalRows,
  handlePriceChange,
  handleSave,
  isPriceEdited,
  isSaving,
  onToggleSuspend,
  onDeleteClick
}) => {
  const [editingQuantity, setEditingQuantity] = useState(false);
  const [quantityValue, setQuantityValue] = useState(quantity.amount);
  const [editingSize, setEditingSize] = useState(false);
  const [sizeName, setSizeName] = useState(size.name);
  const [sizeDimensions, setSizeDimensions] = useState(size.dimensions);
  const [sizeSuspended, setSizeSuspended] = useState(false);

  // Handle size edit save
  const handleSizeEditSave = () => {
    // In a real app, you would update the size in the database
    // For this demo, we're just toggling the edit mode off
    setEditingSize(false);
    // Show a toast for the demo
    // Implementation would include actual API call to update the size
  };

  // Handle quantity edit save
  const handleQuantityEditSave = () => {
    // In a real app, you would update the quantity in the database
    // For this demo, we're just toggling the edit mode off
    setEditingQuantity(false);
    // Show a toast for the demo
    // Implementation would include actual API call to update the quantity
  };

  if (product.isCustom) {
    return (
      <TableRow className="bg-gray-50">
        <TableCell colSpan={6}>
          <div className="flex items-center gap-2">
            <Layers className="text-gray-500 h-4 w-4" />
            <span className="font-semibold">{product.name}</span>
            <span className="text-sm text-gray-500 ml-2">(Custom product - no fixed pricing)</span>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow className={isFirstRow ? "border-t-4 border-gray-100" : ""}>
      {isFirstRow && isFirstSize ? (
        <TableCell rowSpan={totalRows} className="align-top">
          <div className="font-medium">{product.name}</div>
          <div className="text-sm text-gray-500">{product.category}</div>
          {product.suspended && (
            <div className="text-xs text-red-600 font-medium mt-1">Suspended</div>
          )}
        </TableCell>
      ) : null}
      
      {isFirstSize ? (
        <TableCell rowSpan={product.quantities.length} className="align-top">
          {editingSize ? (
            <div className="space-y-2">
              <Input
                value={sizeName}
                onChange={(e) => setSizeName(e.target.value)}
                className="mb-1"
                placeholder="Size Name"
              />
              <Input
                value={sizeDimensions}
                onChange={(e) => setSizeDimensions(e.target.value)}
                className="mb-2"
                placeholder="Dimensions"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSizeEditSave} className="w-full">
                  <Save className="h-3.5 w-3.5 mr-1" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditingSize(false)} className="w-full">
                  <XCircle className="h-3.5 w-3.5 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="font-medium">{size.name}</div>
              <div className="text-sm text-gray-500">{size.dimensions}</div>
              <div className="flex flex-col gap-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingSize(true)}
                  className="w-full"
                >
                  <Edit className="h-3.5 w-3.5 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSizeSuspended(!sizeSuspended)}
                  className="w-full"
                >
                  {sizeSuspended ? (
                    <>
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      Activate
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3.5 w-3.5 mr-1" />
                      Suspend
                    </>
                  )}
                </Button>
              </div>
              {sizeSuspended && (
                <div className="text-xs text-red-600 font-medium mt-1">Suspended</div>
              )}
            </div>
          )}
        </TableCell>
      ) : null}
      
      <TableCell>
        {editingQuantity ? (
          <div className="space-y-2">
            <Input
              type="number"
              min="1"
              value={quantityValue}
              onChange={(e) => setQuantityValue(parseInt(e.target.value, 10))}
              className="mb-2"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleQuantityEditSave} className="w-full">
                <Save className="h-3.5 w-3.5 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditingQuantity(false)} className="w-full">
                <XCircle className="h-3.5 w-3.5 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="font-medium">{quantity.amount} units</div>
            {quantity.isPopular && (
              <div className="text-xs text-green-600 font-medium">Popular Option</div>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setEditingQuantity(true)}
              className="mt-2"
            >
              <Edit className="h-3.5 w-3.5 mr-1" />
              Edit
            </Button>
          </div>
        )}
      </TableCell>
      
      <TableCell>
        <Input
          type="number"
          min="0"
          step="0.01"
          value={isPriceEdited(product.id, size.id, quantity.id) ? 
            undefined : quantity.price}
          onChange={(e) => 
            handlePriceChange(product.id, size.id, quantity.id, e.target.value)
          }
        />
      </TableCell>
      
      <TableCell>
        <Button
          size="sm"
          onClick={() => handleSave(product.id, size.id, quantity.id)}
          disabled={!isPriceEdited(product.id, size.id, quantity.id) || isSaving(product.id, size.id, quantity.id)}
        >
          {isSaving(product.id, size.id, quantity.id) ? (
            <span className="h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-1"></span>
          ) : isPriceEdited(product.id, size.id, quantity.id) ? (
            <Save className="h-3.5 w-3.5 mr-1" />
          ) : (
            <Check className="h-3.5 w-3.5 mr-1" />
          )}
          {isSaving(product.id, size.id, quantity.id)
            ? "Saving"
            : isPriceEdited(product.id, size.id, quantity.id)
            ? "Save"
            : "Saved"}
        </Button>
      </TableCell>
      
      {isFirstRow && isFirstSize ? (
        <TableCell rowSpan={totalRows} className="align-top">
          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onToggleSuspend(product)}
              className="gap-1 w-full"
            >
              {product.suspended ? (
                <>
                  <Eye className="h-3.5 w-3.5" />
                  Activate
                </>
              ) : (
                <>
                  <EyeOff className="h-3.5 w-3.5" />
                  Suspend
                </>
              )}
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              className="gap-1 w-full"
              onClick={() => onDeleteClick(product)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        </TableCell>
      ) : null}
    </TableRow>
  );
};

export default ProductPriceRow;
