import React, { useState } from "react";
import { Printer } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, BadgePercent } from "lucide-react";
import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";

// Fallback image using Unsplash placeholders
const fallbackImages: Record<number, string> = {
  1: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&h=600",
  2: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&h=600",
  3: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&h=600",
  4: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&h=600",
  5: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&h=600",
  6: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&h=600&q=80",
  7: "https://images.unsplash.com/photo-1533310266320-f7f9f6067419?auto=format&fit=crop&w=800&h=600&q=80",
  8: "https://images.unsplash.com/photo-1563770660941-10971f1f61a8?auto=format&fit=crop&w=800&h=600&q=80",
  9: "https://images.unsplash.com/photo-1581092921461-39b9d347a569?auto=format&fit=crop&w=800&h=600&q=80",
  10: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&h=600&q=80",
  11: "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?auto=format&fit=crop&w=800&h=600&q=80",
  12: "https://images.unsplash.com/photo-1563502321-4e4f507445e7?auto=format&fit=crop&w=800&h=600&q=80"
};

interface PrinterCardProps {
  printer: Printer;
}

const PrinterCard: React.FC<PrinterCardProps> = ({ printer }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    console.error(`Failed to load image for ${printer.name}`);
    setImageError(true);
  };

  // Get image source with fallback to Unsplash images
  const getImageSrc = () => {
    if (imageError) {
      return fallbackImages[printer.id] || "";
    }
    return printer.imageUrl;
  };

  return (
    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
      <AspectRatio ratio={4/3} className="bg-gray-100 relative">
        {printer.onSale && (
          <Badge className="absolute top-2 right-2 bg-red-500 text-white">
            <BadgePercent className="h-3 w-3 mr-1" /> Sale
          </Badge>
        )}
        {imageError ? (
          <div className="flex h-full w-full flex-col items-center justify-center p-4 text-gray-400">
            <AlertCircle className="h-12 w-12 mb-2" />
            <p className="text-center text-sm">Image unavailable</p>
            <p className="text-center text-xs">{printer.name}</p>
          </div>
        ) : (
          <img 
            src={getImageSrc()}
            alt={printer.name} 
            className="h-full w-full object-contain p-4"
            loading="lazy"
            onError={handleImageError}
          />
        )}
      </AspectRatio>
      <CardContent className="p-5">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{printer.name}</h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {printer.description}
        </p>
        
        <div className="flex items-baseline mb-4">
          {printer.contactForPrice ? (
            <span className="text-xl font-bold text-brand-blue">
              {printer.priceRange}
            </span>
          ) : printer.onSale ? (
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="text-xl font-bold text-brand-blue mr-2">
                  ${printer.price.toFixed(2)}
                </span>
                <span className="text-gray-500 text-sm line-through">
                  ${printer.originalPrice?.toFixed(2)}
                </span>
              </div>
              <span className="text-gray-500 text-sm">
                {printer.gstIncluded ? 'Incl. GST' : 'Excl. GST'}
              </span>
            </div>
          ) : printer.priceRange ? (
            <div className="flex flex-col">
              <span className="text-xl font-bold text-brand-blue">
                {printer.priceRange}
              </span>
              <span className="text-gray-500 text-sm">
                {printer.gstIncluded ? 'Incl. GST' : 'Excl. GST'}
              </span>
            </div>
          ) : (
            <div className="flex flex-col">
              <span className="text-xl font-bold text-brand-blue">
                ${printer.price.toFixed(2)}
              </span>
              <span className="text-gray-500 text-sm">
                {printer.gstIncluded ? 'Incl. GST' : 'Excl. GST'}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex justify-center mt-4">
          <Link to={`/contact?printer=${encodeURIComponent(printer.name)}`} className="w-full">
            <Button className="w-full">Request Quote</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrinterCard;
