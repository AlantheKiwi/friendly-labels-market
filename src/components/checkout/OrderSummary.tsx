
import React from "react";
import { useCart } from "@/context/CartContext";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const OrderSummary: React.FC = () => {
  const { items, subtotal, removeFromCart } = useCart();
  
  // Updated: Free shipping
  const shippingCost = 0.00;
  
  // GST calculation (15% in New Zealand)
  const gstRate = 0.15;
  const gstAmount = (subtotal + shippingCost) * gstRate;
  
  // Total including GST
  const total = subtotal + shippingCost + gstAmount;

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

        <div className="divide-y">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.sizeId}-${item.quantityId}`}
              className="py-4 flex items-start"
            >
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 mr-4">
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between text-base font-medium">
                  <h3>{item.productName}</h3>
                  <p className="ml-4">${item.price.toFixed(2)}</p>
                </div>
                <p className="mt-1 text-sm text-gray-500">{item.dimensions}</p>
                <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity.amount}</p>
                <div className="flex justify-end mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.productId, item.sizeId, item.quantityId)}
                    className="text-gray-400 hover:text-red-500 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <p>Subtotal (Ex GST)</p>
            <p>${subtotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between text-sm">
            <p>Free Shipping</p>
            <p>${shippingCost.toFixed(2)}</p>
          </div>
          <div className="flex justify-between text-sm">
            <p>GST (15%)</p>
            <p>${gstAmount.toFixed(2)}</p>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-semibold text-lg">
            <p>Total (Inc GST)</p>
            <p>${total.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
