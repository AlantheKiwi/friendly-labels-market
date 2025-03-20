
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { CustomerInfo } from "@/types";

interface CustomerInformationFormProps {
  onSubmit: (e: React.FormEvent, formData: CustomerInfo) => void;
}

const CustomerInformationForm: React.FC<CustomerInformationFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    address1: "",
    address2: "",
    city: "",
    postalCode: "",
    notes: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e, formData);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName" 
                value={formData.firstName}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                value={formData.lastName}
                onChange={handleChange}
                required 
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                value={formData.phone}
                onChange={handleChange}
                required 
              />
            </div>
          </div>
          <div className="mt-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company (Optional)</Label>
              <Input 
                id="company" 
                value={formData.company}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address1">Address Line 1</Label>
              <Input 
                id="address1" 
                value={formData.address1}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address2">Address Line 2 (Optional)</Label>
              <Input 
                id="address2" 
                value={formData.address2}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city" 
                  value={formData.city}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input 
                  id="postalCode" 
                  value={formData.postalCode}
                  onChange={handleChange}
                  required 
                />
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
              value={formData.notes}
              onChange={handleChange}
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
