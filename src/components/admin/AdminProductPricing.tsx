
import React, { useState, useEffect } from "react";
import { productList } from "@/data/products/index";
import { Product, ProductQuantity, ProductSize } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Search, Save, Check, RefreshCcw, Layers, Edit, Trash2, EyeOff, Eye } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

const AdminProductPricing = () => {
  const [products, setProducts] = useState<Product[]>(productList);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [editedPrices, setEditedPrices] = useState<Record<string, Record<string, Record<string, { price: number }>>>>({}); // product->size->quantity
  const [savingIds, setSavingIds] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToAction, setProductToAction] = useState<Product | null>(null);
  const { toast } = useToast();

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(products.map(product => product.category)))];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRevertPrice(productId, sizeId, quantityId)}
            className="gap-1"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            Undo
          </Button>
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

  const isPriceEdited = (productId: string, sizeId: string, quantityId: string) => {
    return !!editedPrices[productId]?.[sizeId]?.[quantityId];
  };

  const isSaving = (productId: string, sizeId: string, quantityId: string) => {
    return savingIds.includes(`${productId}-${sizeId}-${quantityId}`);
  };

  const handleToggleSuspend = (product: Product) => {
    setProducts(prev => 
      prev.map(p => 
        p.id === product.id ? { ...p, suspended: !p.suspended } : p
      )
    );
    
    toast({
      title: product.suspended ? "Product activated" : "Product suspended",
      description: `${product.name} has been ${product.suspended ? "activated" : "suspended"}`,
    });
  };

  const handleConfirmDelete = () => {
    if (!productToAction) return;
    
    setProducts(prev => prev.filter(p => p.id !== productToAction.id));
    
    toast({
      title: "Product deleted",
      description: `${productToAction.name} has been deleted`,
    });
    
    setIsDeleteDialogOpen(false);
    setProductToAction(null);
  };

  const openDeleteDialog = (product: Product) => {
    setProductToAction(product);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="w-full sm:w-64">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className="w-40">Price (NZD)</TableHead>
              <TableHead className="w-32">Save</TableHead>
              <TableHead className="w-40">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.flatMap(product => 
                product.isCustom 
                ? [
                    <TableRow key={product.id} className="bg-gray-50">
                      <TableCell colSpan={6}>
                        <div className="flex items-center gap-2">
                          <Layers className="text-gray-500 h-4 w-4" />
                          <span className="font-semibold">{product.name}</span>
                          <span className="text-sm text-gray-500 ml-2">(Custom product - no fixed pricing)</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ]
                : product.sizes.flatMap(size => 
                    product.quantities.map((quantity, qIndex) => (
                      <TableRow 
                        key={`${product.id}-${size.id}-${quantity.id}`} 
                        className={(qIndex === 0 && size.id === product.sizes[0].id) ? "border-t-4 border-gray-100" : ""}
                      >
                        {qIndex === 0 && size.id === product.sizes[0].id ? (
                          <TableCell rowSpan={product.quantities.length * product.sizes.length} className="align-top">
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.category}</div>
                            {product.suspended && (
                              <div className="text-xs text-red-600 font-medium mt-1">Suspended</div>
                            )}
                          </TableCell>
                        ) : null}
                        
                        {qIndex === 0 ? (
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
                            value={
                              editedPrices[product.id]?.[size.id]?.[quantity.id]?.price !== undefined
                                ? editedPrices[product.id][size.id][quantity.id].price
                                : quantity.price
                            }
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
                        
                        {qIndex === 0 && size.id === product.sizes[0].id ? (
                          <TableCell rowSpan={product.quantities.length * product.sizes.length} className="align-top">
                            <div className="flex flex-col gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleToggleSuspend(product)}
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
                                onClick={() => openDeleteDialog(product)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        ) : null}
                      </TableRow>
                    ))
                  )
              )
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-gray-500">
                  No products found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete {productToAction?.name}? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProductPricing;
