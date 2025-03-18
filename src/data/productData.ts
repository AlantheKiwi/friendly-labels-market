
import { Product } from "@/types";

export const products: Product[] = [
  {
    id: "thermal-labels",
    name: "Direct Thermal Labels",
    slug: "direct-thermal-labels",
    description: "High-quality direct thermal labels, perfect for shipping, barcode labeling, and product identification. Compatible with all standard thermal printers.",
    imageUrl: "/lovable-uploads/b244118b-edda-4ebc-9ee8-5ccac70f30dc.png",
    category: "Thermal Labels",
    popularUses: [
      "Shipping labels",
      "Product labeling",
      "Barcode printing",
      "Price tags",
      "Inventory management"
    ],
    features: [
      "Premium thermal paper quality",
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
        price: 22.99,
        basePrice: 25.98,
        discountPercent: 12,
        isPopular: true
      },
      {
        id: "qty-3",
        amount: 2000,
        price: 41.99,
        basePrice: 51.96,
        discountPercent: 20
      },
      {
        id: "qty-4",
        amount: 5000,
        price: 94.99,
        basePrice: 129.95,
        discountPercent: 27
      }
    ]
  },
  {
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
        price: 84.99,
        basePrice: 99.96,
        discountPercent: 15
      }
    ]
  },
  {
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
        price: 74.99,
        basePrice: 79.98,
        discountPercent: 6
      },
      {
        id: "qty-3",
        amount: 5000,
        price: 174.99,
        basePrice: 199.95,
        discountPercent: 13
      }
    ]
  },
  {
    id: "custom-labels",
    name: "Custom Labels",
    slug: "custom-labels",
    description: "Bespoke thermal labels manufactured to your exact specifications. Perfect for unique requirements and special applications.",
    imageUrl: "/lovable-uploads/b244118b-edda-4ebc-9ee8-5ccac70f30dc.png",
    category: "Custom Labels",
    popularUses: [
      "Special size requirements",
      "Branded packaging",
      "Unique applications",
      "Industry-specific needs",
      "Complex identification systems"
    ],
    features: [
      "Made to your exact specifications",
      "Custom sizing available",
      "Choice of adhesive strength",
      "Fast turnaround times",
      "Bulk ordering available"
    ],
    sizes: [
      {
        id: "custom",
        name: "Custom Size",
        dimensions: "Any dimensions",
        sortOrder: 1
      }
    ],
    quantities: [
      {
        id: "custom",
        amount: 0,
        price: 0,
        basePrice: 0,
        discountPercent: 0
      }
    ],
    isCustom: true
  }
];
