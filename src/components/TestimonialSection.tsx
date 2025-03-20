
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "The thermal labels we ordered arrived the next day as promised. The quality is excellent and our barcodes scan perfectly every time. Highly recommended!",
    author: "Sean Lange",
    company: "Field Tek, Christchurch",
    rating: 5
  },
  {
    quote: "We've been ordering our shipping labels in bulk for over a year now. The price is competitive and the customer service is always helpful. Our go-to supplier.",
    author: "Mike Thompson",
    company: "NZ Distribution Co.",
    rating: 5
  },
  {
    quote: "The custom size labels we ordered were perfect for our unique packaging needs. The team helped us get exactly what we needed with no hassle.",
    author: "The Herbal Gardens",
    company: "West Melton",
    rating: 5
  }
];

const TestimonialSection: React.FC = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container-custom">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="h-full">
              <CardContent className="pt-6 h-full flex flex-col">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 flex-grow">"{testimonial.quote}"</p>
                <div className="mt-auto">
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.company}</p>
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
