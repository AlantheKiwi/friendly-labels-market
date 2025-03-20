
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto prose">
            <h1 className="heading-lg mb-6">Privacy Policy for Service Labels NZ</h1>
            
            <p className="text-gray-600 mb-6">
              <strong>Effective Date:</strong> March 12, 2025<br />
              <strong>Trading Name:</strong> Service Labels NZ<br />
              <strong>Parent Company:</strong> Insight AI Systems Limited<br />
              <strong>Address:</strong> Unit 2/1 Doric Way, Islington, Christchurch, New Zealand<br />
              <strong>Phone:</strong> 020 4114 9601<br />
              <strong>Website:</strong> <a href="https://www.servicelabels.co.nz" className="text-brand-blue hover:underline">https://www.servicelabels.co.nz</a>
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how Service Labels NZ (operated by Insight AI Systems Limited) collects, uses, and safeguards your information when you visit our website or use our services.</p>
            
            <h2 className="text-2xl font-semibold mb-4 mt-6">2. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Personal Information:</strong> Name, email address, phone number, shipping address, billing information.</li>
              <li><strong>Order Information:</strong> Products purchased, order history, payment details.</li>
              <li><strong>Technical Information:</strong> IP address, browser type, device information, cookies, and usage data.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mb-4 mt-6">3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your orders and services</li>
              <li>Improve our website and customer service</li>
              <li>Send promotional materials if you've opted in</li>
              <li>Comply with legal obligations</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mb-4 mt-6">4. Cookies and Tracking Technologies</h2>
            <p>We use cookies and similar technologies to enhance your browsing experience, analyze website traffic, and personalize content. You can manage your cookie preferences through your browser settings or our cookie preference center.</p>
            
            <h2 className="text-2xl font-semibold mb-4 mt-6">5. Data Sharing and Disclosure</h2>
            <p>We may share your information with:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Service providers (shipping companies, payment processors)</li>
              <li>Business partners with your consent</li>
              <li>Legal authorities when required by law</li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>
            
            <h2 className="text-2xl font-semibold mb-4 mt-6">6. Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
            
            <h2 className="text-2xl font-semibold mb-4 mt-6">7. Your Rights</h2>
            <p>Under the New Zealand Privacy Act 2020, you have the right to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to certain processing activities</li>
              <li>Withdraw consent for marketing communications</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mb-4 mt-6">8. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the effective date.</p>
            
            <h2 className="text-2xl font-semibold mb-4 mt-6">9. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
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

export default PrivacyPolicy;
