
import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Invoice from "@/components/checkout/Invoice";
import { CheckCircle } from "lucide-react";

const ThankYouPage = () => {
  const location = useLocation();
  const orderData = location.state?.orderData;

  // If no order data was passed, redirect to home
  if (!orderData) {
    return <Navigate to="/" />;
  }

  // Verify payment ID is present (ensuring payment was completed)
  if (!orderData.paymentId) {
    return <Navigate to="/checkout" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container-custom max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold">Thank You For Your Order!</h1>
            <p className="text-gray-600 mt-2">
              Your order has been confirmed and will be processed shortly.
            </p>
          </div>

          <Invoice orderData={orderData} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ThankYouPage;
