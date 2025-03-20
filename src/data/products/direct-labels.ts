
import { Product } from "@/types";

export const directLabels: Product = {
  id: "thermal-labels",
  name: "Direct Labels",
  slug: "direct-thermal-labels",
  description: "High-quality direct labels, perfect for shipping, barcode labeling, and product identification. Compatible with all standard thermal printers.",
  imageUrl: "/lovable-uploads/b244118b-edda-4ebc-9ee8-5ccac70f30dc.png",
  category: "Labels",
  popularUses: [
    "Shipping labels",
    "Product labeling",
    "Barcode printing",
    "Price tags",
    "Inventory management"
  ],
  features: [
    "Premium paper quality",
    "Excellent print definition",
    "Smudge resistant",
    "Easy peel backing",
    "Compatible with all thermal printers"
  ],
  sizes: [
    {
      id: "size-1",
      name: "Small",
      dimensions: "50mm x 25mm",
      sortOrder: 1
    },
    {
      id: "size-2",
      name: "Medium",
      dimensions: "76mm x 50mm",
      sortOrder: 2
    },
    {
      id: "size-3",
      name: "Large",
      dimensions: "100mm x 150mm",
      sortOrder: 3
    }
  ],
  quantities: [
    {
      id: "qty-1",
      amount: 500,
      price: 12.99,
      basePrice: 12.99,
      discountPercent: 0
    },
    {
      id: "qty-2",
      amount: 1000,
      price: 22.86,
      basePrice: 25.98,
      discountPercent: 12,
      isPopular: true
    },
    {
      id: "qty-3",
      amount: 2000,
      price: 41.57,
      basePrice: 51.96,
      discountPercent: 20
    },
    {
      id: "qty-4",
      amount: 5000,
      price: 94.86,
      basePrice: 129.95,
      discountPercent: 27
    }
  ]
};
