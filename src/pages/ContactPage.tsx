
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { PhoneCall, Mail, MapPin, Clock } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="bg-brand-blue py-12">
          <div className="container px-4 mx-auto">
            <h1 className="text-4xl font-bold text-white text-center">Contact Us</h1>
            <p className="text-white text-center mt-4 max-w-2xl mx-auto">
              Have questions about our products or services? We're here to help. Reach out to our team.
            </p>
          </div>
        </div>

        <div className="container px-4 mx-auto py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Get In Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <PhoneCall className="text-brand-blue w-5 h-5 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-700">Phone</p>
                    <p className="text-gray-600">(+61) 1800 123 456</p>
                    <p className="text-gray-600">Monday to Friday, 9am to 5pm AEST</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="text-brand-blue w-5 h-5 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-700">Email</p>
                    <p className="text-gray-600">info@insightai.com.au</p>
                    <p className="text-gray-600">support@insightai.com.au</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="text-brand-blue w-5 h-5 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-700">Office</p>
                    <p className="text-gray-600">Suite 123, Level 45</p>
                    <p className="text-gray-600">101 Collins Street</p>
                    <p className="text-gray-600">Melbourne VIC 3000</p>
                    <p className="text-gray-600">Australia</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="text-brand-blue w-5 h-5 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-700">Business Hours</p>
                    <p className="text-gray-600">Monday to Friday: 9am - 5pm</p>
                    <p className="text-gray-600">Saturday: 10am - 2pm</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
