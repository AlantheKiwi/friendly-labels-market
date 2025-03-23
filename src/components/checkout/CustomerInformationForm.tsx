import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomerInfo, AddressInfo, CheckoutFormData } from "@/types/checkout";
import AddressForm from "./AddressForm";

interface CustomerInformationFormProps {
  onSubmit: (e: React.FormEvent, formData: CustomerInfo) => void;
  initialData?: CheckoutFormData | null;
}

const CustomerInformationForm: React.FC<CustomerInformationFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<CheckoutFormData>({
    contactInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
    },
    shippingAddress: {
      fullName: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "New Zealand",
    },
    billingAddress: {
      fullName: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "New Zealand",
    },
    billingSameAsShipping: true,
    notes: ""
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [id]: value
      }
    }));
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      notes: e.target.value
    }));
  };

  const handleShippingAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [field]: value
      }
    }));
  };

  const handleBillingAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      billingAddress: {
        ...prev.billingAddress,
        [field]: value
      }
    }));
  };

  const handleBillingSameChange = () => {
    setFormData(prev => ({
      ...prev,
      billingSameAsShipping: !prev.billingSameAsShipping
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const customerInfo: CustomerInfo = {
      firstName: formData.contactInfo.firstName,
      lastName: formData.contactInfo.lastName,
      email: formData.contactInfo.email,
      phone: formData.contactInfo.phone,
      company: formData.contactInfo.company,
      address1: formData.shippingAddress.address1,
      address2: formData.shippingAddress.address2,
      city: formData.shippingAddress.city,
      postalCode: formData.shippingAddress.postalCode,
      billingFullName: formData.billingAddress.fullName,
      billingAddress1: formData.billingAddress.address1,
      billingAddress2: formData.billingAddress.address2,
      billingCity: formData.billingAddress.city,
      billingState: formData.billingAddress.state,
      billingPostalCode: formData.billingAddress.postalCode,
      billingCountry: formData.billingAddress.country,
      notes: formData.notes,
      billingSameAsShipping: formData.billingSameAsShipping
    };
    
    onSubmit(e, customerInfo);
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
                value={formData.contactInfo.firstName}
                onChange={handleContactChange}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                value={formData.contactInfo.lastName}
                onChange={handleContactChange}
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
                value={formData.contactInfo.email}
                onChange={handleContactChange}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                value={formData.contactInfo.phone}
                onChange={handleContactChange}
                required 
              />
            </div>
          </div>
          <div className="mt-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company (Optional)</Label>
              <Input 
                id="company" 
                value={formData.contactInfo.company}
                onChange={handleContactChange}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          <AddressForm 
            type="shipping"
            data={formData.shippingAddress}
            onChange={handleShippingAddressChange}
          />
        </div>

        <Separator />

        <div className="flex items-center space-x-2 mb-4">
          <Checkbox 
            id="billingSame" 
            checked={formData.billingSameAsShipping} 
            onCheckedChange={handleBillingSameChange} 
          />
          <Label htmlFor="billingSame" className="cursor-pointer">
            Billing address is the same as shipping address
          </Label>
        </div>

        {!formData.billingSameAsShipping && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
            <AddressForm 
              type="billing"
              data={formData.billingAddress}
              onChange={handleBillingAddressChange}
            />
          </div>
        )}

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
              onChange={handleNotesChange}
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
