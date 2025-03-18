
import { Product } from "@/types";
import { products } from "./productData";

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(product => product.slug === slug);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

// You can add more product-related utility functions here as needed
