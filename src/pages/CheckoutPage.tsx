
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CreditCard } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import CustomerInformationForm from "@/components/checkout/CustomerInformationForm";
import PaymentMethodSelector from "@/components/checkout/PaymentMethodSelector";
import OrderSummary from "@/components/checkout/OrderSummary";
import EmptyCart from "@/components/checkout/EmptyCart";
import { CustomerInfo } from "@/types/checkout";

const CheckoutPage = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("stripe");
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"details" | "payment">("details");
  
  // Shipping cost calculation (simplified)
  const shippingCost = 9.99;
  
  // GST calculation (15% in New Zealand)
  const gstRate = 0.15;
  const gstAmount = (subtotal + shippingCost) * gstRate;
  
  // Total including GST
  const total = subtotal + shippingCost + gstAmount;

  const handleCustomerInfoSubmit = (e: React.FormEvent, formData: CustomerInfo) => {
    e.preventDefault();
    setCustomerInfo(formData);
    setPaymentStep("payment");
  };

  const handlePaymentSuccess = (paymentId: string) => {
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
      customerInfo: customerInfo!,
      items: items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        dimensions: item.dimensions
      })),
      paymentMethod: selectedPaymentMethod,
      paymentId: paymentId,
      subtotal,
      shipping: shippingCost,
      gst: gstAmount,
      total
    };
    
    // Show toast
    toast({
      title: "Payment Successful",
      description: "Your order has been placed successfully.",
    });
    
    // Clear cart
    clearCart();
    
    // Navigate to thank you page with order data
    navigate("/thank-you", { state: { orderData } });
  };

  const handleBack = () => {
    if (paymentStep === "payment") {
      setPaymentStep("details");
    } else {
      navigate(-1);
    }
  };

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8">
        <div className="container-custom">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={handleBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> 
            {paymentStep === "payment" ? "Back to Details" : "Back to Cart"}
          </Button>

          <h1 className="text-3xl font-bold mb-8">
            {paymentStep === "details" ? "Checkout" : "Payment"}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Customer Information Form or Payment */}
            <div className="lg:col-span-2">
              {paymentStep === "details" ? (
                <CustomerInformationForm onSubmit={handleCustomerInfoSubmit} />
              ) : (
                <>
                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <CreditCard className="mr-2 h-5 w-5" /> Payment Details
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Complete your purchase securely with our payment options.
                    </p>
                    <PaymentMethodSelector 
                      selectedPaymentMethod={selectedPaymentMethod} 
                      setSelectedPaymentMethod={setSelectedPaymentMethod}
                      total={total}
                      customerEmail={customerInfo?.email || ""}
                      onPaymentSuccess={handlePaymentSuccess}
                      showStripeForm={true}
                    />
                  </div>
                </>
              )}
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
