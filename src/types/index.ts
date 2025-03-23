
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
  onSale?: boolean;
  originalPrice?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price?: number;
  image?: string;
  category: string;
  features?: string[];
  sizes: ProductSize[];
  colors?: string[];
  inStock?: boolean;
  rating?: number;
  reviews?: number;
  bestSeller?: boolean;
  priceOptions?: {
    size: string;
    price: number;
  }[];
  // New fields to match usage
  slug: string;
  imageUrl: string;
  quantities: ProductQuantity[];
  isCustom?: boolean;
  popularUses?: string[];
}

export interface ProductSize {
  id: string;
  name: string;
  dimensions: string;
  sortOrder: number;
}

export interface ProductQuantity {
  id: string;
  amount: number;
  price: number;
  basePrice: number;
  discountPercent: number;
  isPopular?: boolean;
}

export interface CartItem {
  product: Product;
  size: ProductSize;
  quantity: ProductQuantity;
  count: number;
  // Adding these flattened properties to maintain compatibility with existing code
  productId: string;
  productName: string;
  sizeId: string;
  sizeName: string;
  dimensions: string;
  quantityId: string;
  price: number;
  imageUrl: string;
}
