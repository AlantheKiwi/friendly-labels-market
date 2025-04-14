
import { Product } from "@/types";

export const customLabels: Product = {
  id: "custom-labels",
  name: "Custom Labels",
  slug: "custom-labels",
  description: "Bespoke labels manufactured to your exact specifications. Perfect for unique requirements and special applications.",
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
};
