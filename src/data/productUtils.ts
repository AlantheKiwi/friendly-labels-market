
import { Product } from "@/types";
import { productList } from "./products";

export const getProductBySlug = (slug: string): Product | undefined => {
  return productList.find(product => product.slug === slug);
};

export const getProductById = (id: string): Product | undefined => {
  return productList.find(product => product.id === id);
};

// You can add more product-related utility functions here as needed
