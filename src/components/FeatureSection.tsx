import React from "react";
import { Truck, Package, DollarSign, Star, Clock, BadgePercent } from "lucide-react";
const features = [{
  icon: <Truck className="h-8 w-8 text-brand-blue" />,
  title: "Next-Day Delivery",
  description: "Fast shipping across all of New Zealand with our expedited delivery service."
}, {
  icon: <Package className="h-8 w-8 text-brand-blue" />,
  title: "High-Quality Materials",
  description: "Premium thermal labels that ensure clear, long-lasting prints every time."
}, {
  icon: <DollarSign className="h-8 w-8 text-brand-blue" />,
  title: "Competitive Pricing",
  description: "Get the best value without compromising on quality or service."
}, {
  icon: <Star className="h-8 w-8 text-brand-blue" />,
  title: "Expert Support",
  description: "Our team is here to help with product selection and ordering assistance."
}, {
  icon: <Clock className="h-8 w-8 text-brand-blue" />,
  title: "Quick Reordering",
  description: "Easily reorder your favorite products with just a few clicks."
}, {
  icon: <BadgePercent className="h-8 w-8 text-brand-blue" />,
  title: "Bulk Discounts",
  description: "Save more when you order in larger quantities for your business needs."
}];
const FeatureSection: React.FC = () => {
  return <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-lg mb-4">Why Choose Our Labels?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">We provide top-quality printer labels backed by exceptional service and fast delivery across New Zealand.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>)}
        </div>
      </div>
    </section>;
};
export default FeatureSection;