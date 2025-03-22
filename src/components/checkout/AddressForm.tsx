
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddressInfo } from "@/types/checkout";

interface AddressFormProps {
  type: "shipping" | "billing";
  data: AddressInfo;
  onChange: (field: string, value: string) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ type, data, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    onChange(`${id}`, value);
  };

  const prefix = type === "shipping" ? "" : "billing";

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
