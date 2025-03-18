
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface CustomerInformationFormProps {
  onSubmit: (e: React.FormEvent) => void;
}

const CustomerInformationForm: React.FC<CustomerInformationFormProps> = ({ onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" required />
            </div>
          </div>
          <div className="mt-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company (Optional)</Label>
              <Input id="company" />
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address1">Address Line 1</Label>
              <Input id="address1" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address2">Address Line 2 (Optional)</Label>
              <Input id="address2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input id="postalCode" required />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
          <div className="space-y-2">
            <Label htmlFor="notes">Order Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Special instructions for your order"
              className="min-h-[100px]"
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          className="w-full h-11 px-8 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          Place Order
        </button>
        <p className="text-sm text-gray-500 mt-2 text-center">
          By placing your order, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </form>
  );
};

export default CustomerInformationForm;
