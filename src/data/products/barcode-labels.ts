
import { Product } from "@/types";

export const barcodeLabels: Product = {
  id: "barcode-labels",
  name: "Barcode Labels",
  slug: "barcode-labels",
  description: "High-definition barcode labels perfect for retail, inventory management, and product tracking applications.",
  imageUrl: "/lovable-uploads/40dd8d58-9c2c-4de6-a990-ee3956f82e08.png",
  category: "Barcode Labels",
  popularUses: [
    "Retail price tags",
    "Inventory control",
    "Asset tracking",
    "Product identification",
    "Supply chain management"
  ],
  features: [
    "High scan reliability",
    "Sharp barcode definition",
    "Multiple barcode format support",
    "Strong adhesive backing",
    "Compatible with all standard thermal printers"
  ],
  sizes: [
    {
      id: "size-1",
      name: "Standard",
      dimensions: "76mm x 76mm",
      sortOrder: 1
    },
    {
      id: "size-2",
      name: "Small",
      dimensions: "50mm x 30mm",
      sortOrder: 2
    }
  ],
  quantities: [
    {
      id: "qty-1",
      amount: 1000,
      price: 39.99,
      basePrice: 39.99,
      discountPercent: 0,
      isPopular: true
    },
    {
      id: "qty-2",
      amount: 2000,
      price: 79.98,
      basePrice: 79.98,
      discountPercent: 0
    },
    {
      id: "qty-3",
      amount: 5000,
      price: 199.95,
      basePrice: 199.95,
      discountPercent: 0
    }
  ]
};
