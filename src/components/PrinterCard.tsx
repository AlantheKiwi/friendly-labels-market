
import React, { useState } from "react";
import { Printer } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// Import fallback images
import tscTe200Image from "/images/printers/tsc-te-200.jpg";
import tscTe300Image from "/images/printers/tsc-te-300.jpg";
import zebraZd230Image from "/images/printers/zebra-zd230.jpg";
import zebraZd620Image from "/images/printers/zebra-zd620.jpg";
import zebraZd621Image from "/images/printers/zebra-zd621.jpg";
import honeywellPc42tImage from "/images/printers/honeywell-pc42t.jpg";

// Fallback image map
const imageMap: Record<number, string> = {
  1: tscTe200Image,
  2: tscTe300Image,
  3: zebraZd230Image,
  4: zebraZd620Image,
  5: zebraZd621Image,
  6: honeywellPc42tImage
};

// Fallback image using Unsplash placeholders
const fallbackImages: Record<number, string> = {
  1: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&h=600",
  2: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&h=600",
  3: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&h=600",
  4: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&h=600",
  5: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&h=600",
  6: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&h=600&q=80"
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

  // Try to use imported image, then fallback to imageUrl, then fallback image
  const getImageSrc = () => {
    try {
      // First try locally imported image
      if (imageMap[printer.id]) {
        return imageMap[printer.id];
      }
      // Then try URL from printer data
      return printer.imageUrl;
    } catch (err) {
      console.error("Error loading image:", err);
      // Finally use fallback
      return fallbackImages[printer.id] || "";
    }
  };

  return (
    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
      <AspectRatio ratio={4/3} className="bg-gray-100">
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
        <h3 className="font-semibold text-lg mb-2">{printer.name}</h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {printer.description}
        </p>
        
        <div className="flex items-baseline mb-4">
          <span className="text-xl font-bold text-brand-blue">
            ${printer.price.toFixed(2)}
          </span>
          <span className="text-gray-500 text-sm ml-1">
            {printer.gstIncluded ? 'Incl. GST' : 'Excl. GST'}
          </span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Link to={`/contact?printer=${encodeURIComponent(printer.name)}`} className="flex-1">
            <Button className="w-full">Request Quote</Button>
          </Link>
          <a href={printer.originalUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="outline" className="w-full">
              View Original <ExternalLink className="ml-1 h-4 w-4" />
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrinterCard;
