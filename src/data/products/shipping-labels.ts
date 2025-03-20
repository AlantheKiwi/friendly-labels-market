
import { Product } from "@/types";

export const shippingLabels: Product = {
  id: "shipping-labels",
  name: "Shipping Labels",
  slug: "shipping-labels",
  description: "Premium shipping labels designed specifically for e-commerce and logistics. Optimized for NZ Post and courier services across New Zealand.",
  imageUrl: "/lovable-uploads/b244118b-edda-4ebc-9ee8-5ccac70f30dc.png",
  category: "Shipping Labels",
  popularUses: [
    "Online store orders",
    "Parcel delivery",
    "Returns processing",
    "Inventory tracking",
    "Warehouse management"
  ],
  features: [
    "Reinforced adhesive",
    "Weather-resistant",
    "Easy to scan barcodes",
    "NZ Post compatible",
    "Available in various sizes"
  ],
  sizes: [
    {
      id: "size-1",
      name: "Standard",
      dimensions: "101mm x 149mm",
      sortOrder: 1
    },
    {
      id: "size-2",
      name: "Large",
      dimensions: "100mm x 200mm",
      sortOrder: 2
    }
  ],
  quantities: [
    {
      id: "qty-1",
      amount: 500,
      price: 24.99,
      basePrice: 24.99,
      discountPercent: 0
    },
    {
      id: "qty-2",
      amount: 1000,
      price: 44.99,
      basePrice: 49.98,
      discountPercent: 10,
      isPopular: true
    },
    {
      id: "qty-3",
      amount: 2000,
      price: 84.97,
      basePrice: 99.96,
      discountPercent: 15
    }
  ]
};
