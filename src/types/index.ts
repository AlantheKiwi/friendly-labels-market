
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

export interface CartItem {
  productId: string;
  productName: string;
  sizeId: string;
  sizeName: string;
  dimensions: string;
  quantityId: string;
  price: number;
  imageUrl: string;
  count: number;
}

