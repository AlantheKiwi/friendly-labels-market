
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProductState } from "@/hooks/admin/useProductState";
import { usePriceEditing } from "@/hooks/admin/usePriceEditing";
import ProductSearchFilter from "@/components/admin/products/ProductSearchFilter";
import DeleteProductDialog from "@/components/admin/products/DeleteProductDialog";
import ProductPriceRow from "@/components/admin/products/ProductPriceRow";
import { Product } from "@/types";

const AdminProductPricing = () => {
  const {
    products,
    setProducts,
    filteredProducts,
    categories,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    handleToggleSuspend,
    handleDeleteProduct
  } = useProductState();

  const {
    handlePriceChange,
    handleSave,
    isPriceEdited,
    isSaving,
    handleSaveSize,
    handleToggleSizeStatus,
    handleSaveQuantity
  } = usePriceEditing(products, setProducts);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToAction, setProductToAction] = useState<Product | null>(null);

  const openDeleteDialog = (product: Product) => {
    setProductToAction(product);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!productToAction) return;
    handleDeleteProduct(productToAction.id);
    setIsDeleteDialogOpen(false);
    setProductToAction(null);
  };

  return (
    <div className="space-y-6">
      <ProductSearchFilter 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        categories={categories}
      />
      
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
                    <ProductPriceRow 
                      key={product.id}
                      product={product}
                      size={{} as any}
                      quantity={{} as any}
                      isFirstRow={true}
                      isFirstSize={true}
                      totalRows={1}
                      handlePriceChange={handlePriceChange}
                      handleSave={handleSave}
                      isPriceEdited={isPriceEdited}
                      isSaving={isSaving}
                      onToggleSuspend={handleToggleSuspend}
                      onDeleteClick={openDeleteDialog}
                    />
                  ]
                : product.sizes.flatMap((size, sIndex) => 
                    product.quantities.map((quantity, qIndex) => (
                      <ProductPriceRow 
                        key={`${product.id}-${size.id}-${quantity.id}`}
                        product={product}
                        size={size}
                        quantity={quantity}
                        isFirstRow={qIndex === 0 && sIndex === 0}
                        isFirstSize={qIndex === 0}
                        totalRows={product.quantities.length * product.sizes.length}
                        handlePriceChange={handlePriceChange}
                        handleSave={handleSave}
                        isPriceEdited={isPriceEdited}
                        isSaving={isSaving}
                        onToggleSuspend={handleToggleSuspend}
                        onDeleteClick={openDeleteDialog}
                      />
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

      <DeleteProductDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        product={productToAction}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
};

export default AdminProductPricing;
