
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Icon } from "lucide-react";
import { paymentMethods } from "@/data/paymentData";

interface PaymentMethodSelectorProps {
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (value: string) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedPaymentMethod,
  setSelectedPaymentMethod,
}) => {
  // Import specific icons dynamically based on the icon name in paymentMethods
  const getIconComponent = (iconName: string) => {
    // This is a simple way to render the icon based on its name
    const icons: Record<string, React.ReactNode> = {
      "credit-card": <span className="mr-2 h-5 w-5 text-gray-500">💳</span>,
      "landmark": <span className="mr-2 h-5 w-5 text-gray-500">🏦</span>,
      "calendar": <span className="mr-2 h-5 w-5 text-gray-500">📅</span>,
    };

    return icons[iconName] || null;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
      <RadioGroup
        value={selectedPaymentMethod}
        onValueChange={setSelectedPaymentMethod}
        className="space-y-3"
      >
        {paymentMethods.map((method) => (
          <div key={method.id} className="flex items-center">
            <RadioGroupItem value={method.id} id={method.id} />
            <Label htmlFor={method.id} className="ml-3 flex items-center cursor-pointer">
              {getIconComponent(method.icon)}
              {method.name}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default PaymentMethodSelector;
