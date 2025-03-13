
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const CustomQuotePage = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we would send the form data to a server
    toast({
      title: "Quote Request Submitted",
      description: "We'll get back to you within 24 hours with a custom quote.",
    });
    
    // Reset form or redirect
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container-custom">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="heading-lg mb-4">Request a Custom Quote</h1>
              <p className="text-gray-600">
                Need custom thermal labels? Fill out the form below and we'll provide a personalized quote tailored to your specific requirements.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name*</Label>
                    <Input id="firstName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name*</Label>
                    <Input id="lastName" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address*</Label>
                    <Input id="email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number*</Label>
                    <Input id="phone" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company/Organization</Label>
                  <Input id="company" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="labelSize">Label Size Requirements*</Label>
                  <Input
                    id="labelSize"
                    placeholder="e.g., 50mm x 25mm, 100mm x 150mm"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Estimated Quantity*</Label>
                  <Input
                    id="quantity"
                    placeholder="e.g., 1000, 5000, 10000+"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="details">Additional Details</Label>
                  <Textarea
                    id="details"
                    placeholder="Please provide any specific requirements, deadline, or other information that will help us prepare your custom quote."
                    className="min-h-[150px]"
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Mail className="mr-2 h-4 w-4" /> Submit Quote Request
                </Button>
              </form>
            </div>

            <div className="mt-8 text-center">
              <h3 className="text-xl font-semibold mb-2">Need Immediate Assistance?</h3>
              <p className="text-gray-600 mb-4">
                Contact our team directly for specialized support.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => window.location.href = "tel:0800123456"}>
                  Call Us: 0800 123 456
                </Button>
                <Button variant="outline" onClick={() => window.location.href = "mailto:info@thermallabelsnz.co.nz"}>
                  Email Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CustomQuotePage;
