
import { useState } from "react";
import { Product } from "@/types";
import { productList } from "@/data/products/index";
import { useToast } from "@/components/ui/use-toast";

export const useProductState = () => {
  const [products, setProducts] = useState<Product[]>(productList);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const { toast } = useToast();

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(products.map(product => product.category)))];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    
    toast({
      title: "Product deleted",
      description: "Product has been deleted",
    });
  };

  return {
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
  };
};
