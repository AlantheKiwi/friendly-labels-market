
import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddressInfo } from "@/types/checkout";
import { useAddressFinder } from "@/hooks/useAddressFinder";

interface AddressFormProps {
  type: "shipping" | "billing";
  data: AddressInfo;
  onChange: (field: string, value: string) => void;
}

// Use a placeholder API key - user would need to replace this with a real one
const ADDRESS_FINDER_API_KEY = "DEMO_KEY"; // This is a placeholder - user should replace with real API key

const AddressForm: React.FC<AddressFormProps> = ({ type, data, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    onChange(`${id}`, value);
  };

  const prefix = type === "shipping" ? "" : "billing";
  
  // Create ref for address line 1 input for autocomplete
  const addressInputRef = useRef<HTMLInputElement>(null);
  
  // Initialize AddressFinder on the address input
  useAddressFinder({
    inputRef: addressInputRef,
    apiKey: ADDRESS_FINDER_API_KEY,
    country: 'NZ',
    onAddressSelected: (fullAddress, metaData) => {
      // Update form fields with selected address data
      if (metaData) {
        onChange(`${prefix}address1`, fullAddress);
        
        if (metaData.city) {
          onChange(`${prefix}city`, metaData.city);
        }
        
        if (metaData.postcode) {
          onChange(`${prefix}postalCode`, metaData.postcode);
        }
        
        if (metaData.region) {
          onChange(`${prefix}state`, metaData.region);
        }
        
        // Country is always New Zealand for NZ addresses
        onChange(`${prefix}country`, "New Zealand");
      }
    }
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${prefix}fullName`}>Full Name</Label>
          <Input 
            id={`${prefix}fullName`} 
            value={data.fullName}
            onChange={handleChange}
            required 
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}address1`}>Address Line 1</Label>
        <Input 
          id={`${prefix}address1`} 
          value={data.address1}
          onChange={handleChange}
          ref={addressInputRef}
          placeholder="Start typing your address..."
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}address2`}>Address Line 2 (Optional)</Label>
        <Input 
          id={`${prefix}address2`} 
          value={data.address2}
          onChange={handleChange}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${prefix}city`}>City</Label>
          <Input 
            id={`${prefix}city`} 
            value={data.city}
            onChange={handleChange}
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${prefix}state`}>State/Province</Label>
          <Input 
            id={`${prefix}state`} 
            value={data.state}
            onChange={handleChange}
            required 
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${prefix}postalCode`}>ZIP/Postal Code</Label>
          <Input 
            id={`${prefix}postalCode`} 
            value={data.postalCode}
            onChange={handleChange}
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${prefix}country`}>Country</Label>
          <Input 
            id={`${prefix}country`} 
            value={data.country || "New Zealand"}
            onChange={handleChange}
            required 
          />
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
