
export interface AddressInfo {
  fullName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  // Shipping address
  address1: string;
  address2: string;
  city: string;
  postalCode: string;
  // Billing address (when different from shipping)
  billingFullName: string;
  billingAddress1: string;
  billingAddress2: string;
  billingCity: string;
  billingState: string;
  billingPostalCode: string;
  billingCountry: string;
  // Additional info
  notes: string;
  billingSameAsShipping: boolean;
}

export interface CheckoutFormData {
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
  };
  shippingAddress: AddressInfo;
  billingAddress: AddressInfo;
  billingSameAsShipping: boolean;
  notes: string;
}
