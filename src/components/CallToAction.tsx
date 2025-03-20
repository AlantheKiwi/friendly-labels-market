
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface CallToActionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

const CallToAction: React.FC<CallToActionProps> = ({
  title = "Ready to Order Your Labels?",
  description = "Get high-quality printer labels delivered across New Zealand with next-day shipping.",
  buttonText = "Shop Now",
  buttonLink = "/products",
  secondaryButtonText = "Request Custom Quote",
  secondaryButtonLink = "/custom-quote",
}) => {
  return (
    <section className="py-16 bg-brand-blue">
      <div className="container-custom text-center">
        <h2 className="heading-lg text-white mb-4">{title}</h2>
        <p className="text-white/80 mb-8 max-w-2xl mx-auto">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="bg-white text-brand-blue hover:bg-gray-100 transition-colors">
            <Link to={buttonLink}>
              {buttonText} <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          {secondaryButtonText && (
            <Button asChild size="lg" className="bg-white text-brand-blue hover:bg-gray-100 transition-colors">
              <Link to={secondaryButtonLink}>{secondaryButtonText}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
