
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import FeatureSection from "@/components/FeatureSection";
import TestimonialSection from "@/components/TestimonialSection";
import CallToAction from "@/components/CallToAction";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <FeatureSection />
        <TestimonialSection />
        <CallToAction 
          title="Need Help With Your Printing Needs?" 
          description="Our team of experts is ready to help you find the right printer for your business." 
          buttonText="Contact Us" 
          buttonLink="/contact" 
          secondaryButtonText="View Printers" 
          secondaryButtonLink="/printers" 
        />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
