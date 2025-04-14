
import React from "react";
import { Check } from "lucide-react";

interface ProductFeaturesProps {
  features: string[];
  popularUses: string[];
}

const ProductFeatures: React.FC<ProductFeaturesProps> = ({ features, popularUses }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
      <div>
        <h2 className="text-2xl font-semibold mb-6">Features</h2>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <span className="bg-brand-blue/10 rounded-full p-1 mr-3">
                <Check className="h-4 w-4 text-brand-blue" />
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-6">Popular Uses</h2>
        <ul className="space-y-3">
          {popularUses.map((use, index) => (
            <li key={index} className="flex items-center">
              <span className="bg-brand-blue/10 rounded-full p-1 mr-3">
                <Check className="h-4 w-4 text-brand-blue" />
              </span>
              {use}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductFeatures;
