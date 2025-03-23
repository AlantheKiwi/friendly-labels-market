
export interface Printer {
  id: number;
  name: string;
  description: string;
  price: number;
  priceRange?: string;
  contactForPrice?: boolean;
  gstIncluded: boolean;
  imageUrl: string;
  originalUrl: string;
  suspended?: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  features?: string[];
  sizes?: string[];
  colors?: string[];
  inStock: boolean;
  rating?: number;
  reviews?: number;
  bestSeller?: boolean;
  priceOptions?: {
    size: string;
    price: number;
  }[];
}
