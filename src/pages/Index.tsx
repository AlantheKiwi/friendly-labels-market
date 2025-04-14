
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import FeatureSection from "@/components/FeatureSection";
import CallToAction from "@/components/CallToAction";
import TestimonialSection from "@/components/TestimonialSection";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        <FeatureSection />
        <TestimonialSection />
        <CallToAction />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
