
import { Product } from "@/types";
import { directLabels } from "./direct-labels";
import { shippingLabels } from "./shipping-labels";
import { barcodeLabels } from "./barcode-labels";
import { customLabels } from "./custom-labels";

export const productList: Product[] = [
  directLabels,
  shippingLabels,
  barcodeLabels,
  customLabels
];
