
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto prose">
            <h1 className="heading-lg mb-6">Terms of Service for Service Labels NZ</h1>
            
            <p className="text-gray-600 mb-6">
              <strong>Effective Date:</strong> March 12, 2025<br />
              <strong>Trading Name:</strong> Service Labels NZ<br />
              <strong>Parent Company:</strong> Insight AI Systems Limited<br />
              <strong>Address:</strong> Unit 2/1 Doric Way, Islington, Christchurch, New Zealand<br />
              <strong>Phone:</strong> 020 4114 9601<br />
              <strong>Website:</strong> <a href="https://www.servicelabels.co.nz" className="text-brand-blue hover:underline">https://www.servicelabels.co.nz</a>
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>By accessing our website or placing an order, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
            
            <h2 className="text-2xl font-semibold mb-4 mt-6">2. Product Information</h2>
            <p>We strive to provide accurate product descriptions, pricing, and availability information. However, we reserve the right to correct errors, inaccuracies, or omissions and to change or update information at any time without prior notice.</p>
            
            <h2 className="text-2xl font-semibold mb-4 mt-6">3. Ordering and Payment</h2>
            <p>When you place an order, you represent that the information provided is accurate and complete. All orders are subject to acceptance and availability. Payment must be made at the time of order. We accept major credit cards and bank transfers.</p>
            
            <h2 className="text-2xl font-semibold mb-4 mt-6">4. Shipping and Delivery</h2>
            <p>We aim to process and ship orders promptly. Delivery times are estimates only and not guaranteed. We are not responsible for delays caused by shipping carriers or circumstances beyond our control. Risk of loss and title pass to you upon delivery to the carrier.</p>
            
            <h2 className="text-2xl font-semibold mb-4 mt-6">5. Returns and Refunds</h2>
            <p>We accept returns for defective products within 14 days of delivery. Custom or personalized products cannot be returned unless defective. Refunds will be processed within 5-7 business days of receiving the returned item.</p>
            
            <h2 className="text-2xl font-semibold mb-4 mt-6">6. Intellectual Property</h2>
            <p>All content on our website, including text, graphics, logos, and images, is the property of Service Labels NZ or its content suppliers and is protected by New Zealand and international copyright laws.</p>
            
            <h2 className="text-2xl font-semibold mb-4 mt-6">7. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our services or products.</p>
            
            <h2 className="text-2xl font-semibold mb-4 mt-6">8. Governing Law</h2>
            <p>These Terms of Service are governed by the laws of New Zealand. Any disputes arising under these terms will be subject to the exclusive jurisdiction of the courts of New Zealand.</p>
            
            <h2 className="text-2xl font-semibold mb-4 mt-6">9. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Updated terms will be posted on this page with a revised effective date. Your continued use of our website after changes constitutes acceptance of the modified terms.</p>
            
            <h2 className="text-2xl font-semibold mb-4 mt-6">10. Contact Information</h2>
            <p>If you have any questions about these Terms of Service, please contact us at:</p>
            <p>
              Email: <a href="mailto:sales@servicelabels.co.nz" className="text-brand-blue hover:underline">sales@servicelabels.co.nz</a><br />
              Phone: 020 4114 9601
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
