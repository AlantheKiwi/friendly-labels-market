
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "The thermal labels we ordered arrived the next day as promised. The quality is excellent and our barcodes scan perfectly every time. Highly recommended!",
    author: "Sarah Johnson",
    company: "Kiwi Crafts Online",
    rating: 5,
  },
  {
    quote: "We've been ordering our shipping labels in bulk for over a year now. The price is competitive and the customer service is always helpful. Our go-to supplier.",
    author: "Mike Thompson",
    company: "NZ Distribution Co.",
    rating: 5,
  },
  {
    quote: "The custom size labels we ordered were perfect for our unique packaging needs. The team helped us get exactly what we needed with no hassle.",
    author: "Emma Williams",
    company: "Organic Goods NZ",
    rating: 5,
  },
];

const TestimonialSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-lg mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Businesses across New Zealand trust us for their thermal label needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="h-full">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-gray-500 text-sm">{testimonial.company}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
