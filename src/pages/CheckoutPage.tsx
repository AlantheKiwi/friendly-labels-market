
import React, { useState, useEffect } from "react";
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
import CreateAccountPrompt from "@/components/checkout/CreateAccountPrompt";
import { CustomerInfo, CheckoutFormData } from "@/types/checkout";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const CheckoutPage = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user, isClient } = useAuth();
  const navigate = useNavigate();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("stripe");
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"details" | "payment">("details");
  const [initialFormData, setInitialFormData] = useState<CheckoutFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Updated: Free shipping
  const shippingCost = 0.00;
  
  // GST calculation (15% in New Zealand)
  const gstRate = 0.15;
  const gstAmount = (subtotal + shippingCost) * gstRate;
  
  // Total including GST
  const total = subtotal + shippingCost + gstAmount;

  // Fetch user profile data when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user && isClient) {
        setIsLoading(true);
        try {
          // Fetch the user's profile from Supabase
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (error) {
            console.error("Error fetching user profile:", error);
            toast({
              title: "Error fetching profile",
              description: "We couldn't load your saved information.",
              variant: "destructive"
            });
          } else if (profileData) {
            // Prepare initial form data from profile
            const formData: CheckoutFormData = {
              contactInfo: {
                firstName: profileData.first_name || "",
                lastName: profileData.last_name || "",
                email: user.email || "",
                phone: profileData.phone || "",
                company: profileData.company || "",
              },
              shippingAddress: {
                fullName: `${profileData.first_name || ""} ${profileData.last_name || ""}`.trim(),
                address1: profileData.address1 || "",
                address2: profileData.address2 || "",
                city: profileData.city || "",
                state: profileData.state || "",
                postalCode: profileData.postal_code || "",
                country: "New Zealand",
              },
              billingAddress: {
                fullName: `${profileData.first_name || ""} ${profileData.last_name || ""}`.trim(),
                address1: profileData.billing_address1 || profileData.address1 || "",
                address2: profileData.billing_address2 || profileData.address2 || "",
                city: profileData.billing_city || profileData.city || "",
                state: profileData.billing_state || profileData.state || "",
                postalCode: profileData.billing_postal_code || profileData.postal_code || "",
                country: "New Zealand",
              },
              billingSameAsShipping: !profileData.billing_address1,
              notes: ""
            };
            
            setInitialFormData(formData);
            toast({
              title: "Information loaded",
              description: "Your saved information has been pre-filled.",
            });
          }
        } catch (err) {
          console.error("Error in profile fetch:", err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user, isClient]);

  const handleCustomerInfoSubmit = (e: React.FormEvent, formData: CustomerInfo) => {
    e.preventDefault();
    setCustomerInfo(formData);
    setPaymentStep("payment");
  };

  const handlePaymentSuccess = (paymentId: string) => {
    // Set processing state
    setIsProcessingPayment(true);
    
    try {
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
          productId: item.product.id,
          productName: item.productName,
          quantity: item.quantity.amount,
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
    } catch (error) {
      // Show error toast
      toast({
        title: "Order Processing Error",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive"
      });
      setIsProcessingPayment(false);
    }
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
                isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                  </div>
                ) : (
                  <>
                    <CustomerInformationForm 
                      onSubmit={handleCustomerInfoSubmit}
                      initialData={initialFormData} 
                    />
                    
                    {/* Account Creation Prompt - only show if user is not logged in */}
                    {!user && initialFormData?.contactInfo.email && (
                      <CreateAccountPrompt 
                        email={initialFormData.contactInfo.email}
                        firstName={initialFormData.contactInfo.firstName}
                        lastName={initialFormData.contactInfo.lastName}
                      />
                    )}
                  </>
                )
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
                  
                  {/* Account Creation Prompt - also show in payment step if user is not logged in */}
                  {!user && customerInfo?.email && (
                    <CreateAccountPrompt 
                      email={customerInfo.email}
                      firstName={customerInfo.firstName}
                      lastName={customerInfo.lastName}
                    />
                  )}
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
