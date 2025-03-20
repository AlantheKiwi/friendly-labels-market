
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

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  category: string;
  popularUses: string[];
  features: string[];
  sizes: ProductSize[];
  quantities: ProductQuantity[];
  isCustom?: boolean;
}

export interface CartItem {
  productId: string;
  productName: string;
  sizeId: string;
  sizeName: string;
  dimensions: string;
  quantityId: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  postalCode: string;
  notes?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

export interface Printer {
  id: number;
  name: string;
  description: string;
  price: number;
  priceRange?: string;
  originalPrice?: number;
  onSale?: boolean;
  contactForPrice?: boolean;
  gstIncluded: boolean;
  imageUrl: string;
  originalUrl: string;
}
