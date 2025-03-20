
import React, { useState, useEffect } from "react";
import { productList } from "@/data/products/index";
import { Product, ProductQuantity } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Search, Save, Check, RefreshCcw, Layers } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminProductPricing = () => {
  const [products, setProducts] = useState<Product[]>(productList);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [editedPrices, setEditedPrices] = useState<Record<string, Record<string, { price: number; basePrice: number }>>>({});
  const [savingIds, setSavingIds] = useState<string[]>([]);
  const { toast } = useToast();

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(products.map(product => product.category)))];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handlePriceChange = (productId: string, quantityId: string, field: 'price' | 'basePrice', value: string) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue) && value !== "") return;
    
    setEditedPrices(prev => {
      const productEdits = prev[productId] || {};
      const quantityEdits = productEdits[quantityId] || { 
        price: 0,
        basePrice: 0
      };
      
      // Find the current product and quantity
      const product = products.find(p => p.id === productId);
      const quantity = product?.quantities.find(q => q.id === quantityId);
      
      // Get the current values or use defaults
      const currentPrice = quantityEdits.price || quantity?.price || 0;
      const currentBasePrice = quantityEdits.basePrice || quantity?.basePrice || 0;
      
      return {
        ...prev,
        [productId]: {
          ...productEdits,
          [quantityId]: {
            price: field === 'price' ? (value === "" ? 0 : numericValue) : currentPrice,
            basePrice: field === 'basePrice' ? (value === "" ? 0 : numericValue) : currentBasePrice
          }
        }
      };
    });
  };

  const handleSave = (productId: string, quantityId: string) => {
    const savingId = `${productId}-${quantityId}`;
    setSavingIds(prev => [...prev, savingId]);
    
    // Simulate saving to backend
    setTimeout(() => {
      setProducts(prev => 
        prev.map(product => {
          if (product.id === productId) {
            return {
              ...product,
              quantities: product.quantities.map(qty => {
                if (qty.id === quantityId && editedPrices[productId]?.[quantityId]) {
                  const { price, basePrice } = editedPrices[productId][quantityId];
                  
                  // Calculate discount percentage
                  const discountPercent = basePrice > 0 
                    ? Math.round((1 - (price / basePrice)) * 100) 
                    : 0;
                  
                  return {
                    ...qty,
                    price,
                    basePrice,
                    discountPercent
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
        if (newState[productId]) {
          const productState = { ...newState[productId] };
          delete productState[quantityId];
          
          if (Object.keys(productState).length === 0) {
            delete newState[productId];
          } else {
            newState[productId] = productState;
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
            onClick={() => handleRevertPrice(productId, quantityId)}
            className="gap-1"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            Undo
          </Button>
        ),
      });
    }, 800);
  };

  const handleRevertPrice = (productId: string, quantityId: string) => {
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

  const isPriceEdited = (productId: string, quantityId: string) => {
    return !!editedPrices[productId]?.[quantityId];
  };

  const isSaving = (productId: string, quantityId: string) => {
    return savingIds.includes(`${productId}-${quantityId}`);
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
              <TableHead>Quantity</TableHead>
              <TableHead className="w-40">Price (NZD)</TableHead>
              <TableHead className="w-40">Base Price</TableHead>
              <TableHead className="w-32">Discount %</TableHead>
              <TableHead className="w-32">Actions</TableHead>
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
                : product.quantities.map((quantity, qIndex) => (
                    <TableRow key={`${product.id}-${quantity.id}`} className={qIndex === 0 ? "border-t-4 border-gray-100" : ""}>
                      {qIndex === 0 && (
                        <TableCell rowSpan={product.quantities.length} className="align-top">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.category}</div>
                        </TableCell>
                      )}
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
                            editedPrices[product.id]?.[quantity.id]?.price !== undefined
                              ? editedPrices[product.id][quantity.id].price
                              : quantity.price
                          }
                          onChange={(e) => 
                            handlePriceChange(product.id, quantity.id, 'price', e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={
                            editedPrices[product.id]?.[quantity.id]?.basePrice !== undefined
                              ? editedPrices[product.id][quantity.id].basePrice
                              : quantity.basePrice
                          }
                          onChange={(e) => 
                            handlePriceChange(product.id, quantity.id, 'basePrice', e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {quantity.discountPercent > 0 ? (
                          <div className="bg-green-100 text-green-800 text-xs font-medium py-1 px-2 rounded text-center">
                            {quantity.discountPercent}%
                          </div>
                        ) : (
                          <div className="text-gray-500 text-center">0%</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => handleSave(product.id, quantity.id)}
                          disabled={!isPriceEdited(product.id, quantity.id) || isSaving(product.id, quantity.id)}
                        >
                          {isSaving(product.id, quantity.id) ? (
                            <span className="h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-1"></span>
                          ) : isPriceEdited(product.id, quantity.id) ? (
                            <Save className="h-3.5 w-3.5 mr-1" />
                          ) : (
                            <Check className="h-3.5 w-3.5 mr-1" />
                          )}
                          {isSaving(product.id, quantity.id)
                            ? "Saving"
                            : isPriceEdited(product.id, quantity.id)
                            ? "Save"
                            : "Saved"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
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
    </div>
  );
};

export default AdminProductPricing;
