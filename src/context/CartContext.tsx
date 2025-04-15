
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { CartItem, Product, ProductQuantity, ProductSize } from "@/types";
import { getProductById } from "@/data/products";
import { toast } from "@/hooks/use-toast";

interface CartState {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { productId: string; sizeId: string; quantityId: string } }
  | { type: "CLEAR_CART" };

const initialState: CartState = {
  items: [],
  subtotal: 0,
  itemCount: 0,
};

const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.price, 0);
};

const calculateItemCount = (items: CartItem[]): number => {
  return items.length;
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      // Check if item already exists with same productId, sizeId, and quantityId
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.productId === action.payload.productId &&
          item.sizeId === action.payload.sizeId &&
          item.quantityId === action.payload.quantityId
      );

      let updatedItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Replace existing item
        updatedItems = [...state.items];
        updatedItems[existingItemIndex] = action.payload;
      } else {
        // Add new item
        updatedItems = [...state.items, action.payload];
      }

      return {
        ...state,
        items: updatedItems,
        subtotal: calculateSubtotal(updatedItems),
        itemCount: calculateItemCount(updatedItems),
      };
    }
    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter(
        (item) =>
          !(
            item.productId === action.payload.productId &&
            item.sizeId === action.payload.sizeId &&
            item.quantityId === action.payload.quantityId
          )
      );

      return {
        ...state,
        items: updatedItems,
        subtotal: calculateSubtotal(updatedItems),
        itemCount: calculateItemCount(updatedItems),
      };
    }
    case "CLEAR_CART":
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

interface CartContextValue extends CartState {
  addToCart: (
    product: Product,
    selectedSize: ProductSize,
    selectedQuantity: ProductQuantity
  ) => void;
  removeFromCart: (
    productId: string,
    sizeId: string,
    quantityId: string
  ) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Initialize cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        parsedCart.items.forEach((item: CartItem) => {
          dispatch({ type: "ADD_ITEM", payload: item });
        });
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  const addToCart = (
    product: Product,
    selectedSize: ProductSize,
    selectedQuantity: ProductQuantity
  ) => {
    const newItem: CartItem = {
      // Nested objects
      product: product,
      size: selectedSize,
      quantity: selectedQuantity,
      count: 1,
      // Flattened properties for backward compatibility
      productId: product.id,
      productName: product.name,
      sizeId: selectedSize.id,
      sizeName: selectedSize.name,
      dimensions: selectedSize.dimensions,
      quantityId: selectedQuantity.id,
      price: selectedQuantity.price,
      imageUrl: product.imageUrl,
    };

    dispatch({ type: "ADD_ITEM", payload: newItem });
    toast({
      title: "Added to cart",
      description: `${selectedQuantity.amount} ${product.name} (${selectedSize.dimensions})`,
    });
  };

  const removeFromCart = (
    productId: string,
    sizeId: string,
    quantityId: string
  ) => {
    dispatch({
      type: "REMOVE_ITEM",
      payload: { productId, sizeId, quantityId },
    });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const value: CartContextValue = {
    ...state,
    addToCart,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
