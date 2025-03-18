
import React from "react";
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

const CheckoutPage = () => {
  const { items } = useCart();
  const navigate = useNavigate();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState("stripe");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we would process the order here
    toast({
      title: "Order Submitted",
      description: "Your order has been placed successfully.",
    });
    
    // Redirect to a thank you page or order confirmation
    navigate("/thank-you");
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
