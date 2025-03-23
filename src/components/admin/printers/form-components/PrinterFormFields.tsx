
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Printer } from "@/types";

interface PrinterFormFieldsProps {
  formData: Printer;
  errors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void;
}

const PrinterFormFields: React.FC<PrinterFormFieldsProps> = ({
  formData,
  errors,
  handleChange,
  handleCheckboxChange
}) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Printer Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="contactForPrice"
          checked={formData.contactForPrice || false}
          onCheckedChange={(checked) => handleCheckboxChange("contactForPrice", checked as boolean)}
        />
        <Label htmlFor="contactForPrice">Contact for Price (hide price field)</Label>
      </div>
      
      {!formData.contactForPrice && (
        <div className="space-y-2">
          <Label htmlFor="price">Price (NZD)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            className={errors.price ? "border-red-500" : ""}
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="gstIncluded"
          checked={formData.gstIncluded}
          onCheckedChange={(checked) => handleCheckboxChange("gstIncluded", checked as boolean)}
        />
        <Label htmlFor="gstIncluded">GST Included</Label>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          className={errors.imageUrl ? "border-red-500" : ""}
        />
        {errors.imageUrl && <p className="text-red-500 text-sm">{errors.imageUrl}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="originalUrl">Original URL</Label>
        <Input
          id="originalUrl"
          name="originalUrl"
          value={formData.originalUrl}
          onChange={handleChange}
          className={errors.originalUrl ? "border-red-500" : ""}
        />
        {errors.originalUrl && <p className="text-red-500 text-sm">{errors.originalUrl}</p>}
      </div>
    </div>
  );
};

export default PrinterFormFields;
