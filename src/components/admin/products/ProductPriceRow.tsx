
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Trash2, Save, Check, Layers } from "lucide-react";
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
          <div className="font-medium">{size.name}</div>
          <div className="text-sm text-gray-500">{size.dimensions}</div>
        </TableCell>
      ) : null}
      
      <TableCell>
        <div className="font-medium">{quantity.amount} units</div>
        {quantity.isPopular && (
          <div className="text-xs text-green-600 font-medium">Popular Option</div>
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
