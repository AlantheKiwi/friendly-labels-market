
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { 
  Elements, 
  CardElement, 
  useStripe, 
  useElements 
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

// Initialize Stripe with your publishable key
// In a production app, this should be set as an environment variable
const stripePromise = loadStripe("pk_test_your_stripe_publishable_key");

interface StripePaymentFormProps {
  amount: number;
  onPaymentSuccess: (paymentId: string) => void;
  customerEmail: string;
}

const StripeForm = ({ amount, onPaymentSuccess, customerEmail }: StripePaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setProcessing(true);

    // Get the CardElement
    const cardElement = elements.getElement(CardElement);
    
    if (!cardElement) {
      setError("Card element not found");
      setProcessing(false);
      return;
    }

    try {
      // In a real implementation, you would create a payment intent on your server
      // and return a client secret to use here. For demo purposes, we're simulating success.
      
      // Simulate a successful payment
      const mockPaymentId = `pi_${Math.random().toString(36).substring(2, 12)}`;
      
      // Simulate a network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onPaymentSuccess(mockPaymentId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="card-element" className="text-sm font-medium">
          Card Details
        </label>
        <div className="p-3 border rounded-md">
          <CardElement 
            id="card-element"
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button 
        type="submit" 
        disabled={!stripe || processing} 
        className="w-full"
      >
        {processing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay $${amount.toFixed(2)}`
        )}
      </Button>
    </form>
  );
};

// Wrap the form with Stripe Elements
const StripePaymentForm = (props: StripePaymentFormProps) => (
  <div className="mt-4">
    <Elements stripe={stripePromise}>
      <StripeForm {...props} />
    </Elements>
  </div>
);

export default StripePaymentForm;
