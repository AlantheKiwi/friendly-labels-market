
import React, { useState } from "react";
import { Printer } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface PrinterCardProps {
  printer: Printer;
}

const PrinterCard: React.FC<PrinterCardProps> = ({ printer }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    console.error(`Failed to load image for ${printer.name}`);
    setImageError(true);
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
            src={printer.imageUrl} 
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
