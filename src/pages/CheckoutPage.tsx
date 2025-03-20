
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import CustomerInformationForm from "@/components/checkout/CustomerInformationForm";
import PaymentMethodSelector from "@/components/checkout/PaymentMethodSelector";
import OrderSummary from "@/components/checkout/OrderSummary";
import EmptyCart from "@/components/checkout/EmptyCart";
import { CustomerInfo } from "@/types";

const CheckoutPage = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("stripe");
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  
  // Shipping cost calculation (simplified)
  const shippingCost = 9.99;
  
  // GST calculation (15% in New Zealand)
  const gstRate = 0.15;
  const gstAmount = (subtotal + shippingCost) * gstRate;
  
  // Total including GST
  const total = subtotal + shippingCost + gstAmount;

  const handleSubmit = (e: React.FormEvent, formData: CustomerInfo) => {
    e.preventDefault();
    setCustomerInfo(formData);
    
    // Generate order number
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
    const orderDate = new Date().toLocaleDateString('en-NZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Prepare order data for the invoice
    const orderData = {
      orderNumber,
      orderDate,
      customerInfo: formData,
      items: items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        dimensions: item.dimensions
      })),
      paymentMethod: selectedPaymentMethod,
      subtotal,
      shipping: shippingCost,
      gst: gstAmount,
      total
    };
    
    // Show toast
    toast({
      title: "Order Submitted",
      description: "Your order has been placed successfully.",
    });
    
    // Clear cart
    clearCart();
    
    // Navigate to thank you page with order data
    navigate("/thank-you", { state: { orderData } });
  };

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container-custom">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Customer Information Form */}
            <div className="lg:col-span-2">
              <CustomerInformationForm onSubmit={handleSubmit} />
              
              <Separator className="my-8" />
              
              <PaymentMethodSelector 
                selectedPaymentMethod={selectedPaymentMethod} 
                setSelectedPaymentMethod={setSelectedPaymentMethod} 
              />
            </div>

            {/* Order Summary */}
            <div>
              <OrderSummary />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
