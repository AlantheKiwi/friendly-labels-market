
import React from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SheetClose } from "@/components/ui/sheet";

const CartSidebar: React.FC = () => {
  const { items, subtotal, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between pb-4 border-b">
        <h2 className="text-xl font-semibold">Your Cart</h2>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="text-gray-500 hover:text-red-500"
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-auto py-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <ShoppingBag className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Your cart is empty</h3>
            <p className="text-gray-500 mb-4">
              Looks like you haven't added any labels to your cart yet.
            </p>
            <SheetClose asChild>
              <Button onClick={() => navigate("/products")}>Browse Products</Button>
            </SheetClose>
          </div>
        ) : (
          <ul className="space-y-4">
            {items.map((item) => (
              <li
                key={`${item.productId}-${item.sizeId}-${item.quantityId}`}
                className="flex py-3 border-b border-gray-100"
              >
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 mr-4">
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <h3>{item.productName}</h3>
                    <p className="ml-4">${item.price.toFixed(2)}</p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{item.dimensions}</p>
                  <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                  <div className="flex justify-end mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.productId, item.sizeId, item.quantityId)}
                      className="text-gray-500 hover:text-red-500 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {items.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between text-base font-medium text-gray-900 mb-1">
            <p>Subtotal (Ex GST)</p>
            <p>${subtotal.toFixed(2)}</p>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            GST will be calculated at checkout.
          </p>
          <SheetClose asChild>
            <Button className="w-full" onClick={handleCheckout}>
              Checkout
            </Button>
          </SheetClose>
          <div className="mt-2">
            <SheetClose asChild>
              <Button variant="outline" className="w-full" onClick={() => navigate("/products")}>
                Continue Shopping
              </Button>
            </SheetClose>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartSidebar;
