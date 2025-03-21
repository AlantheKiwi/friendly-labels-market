
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tag, Clock } from "lucide-react";
import ClientLayout from "@/components/client/ClientLayout";

const ClientOffersPage = () => {
  // Mock data for offers since we don't have an offers table yet
  const mockOffers = [
    {
      id: "OFF-001",
      title: "20% Off Shipping Labels",
      description: "Get 20% off all shipping labels for the month of May",
      expiryDate: "2024-05-31",
      code: "SHIP20",
      isNew: true
    },
    {
      id: "OFF-002",
      title: "Buy One Get One Free Barcode Labels",
      description: "Purchase any barcode label product and get a second one free",
      expiryDate: "2024-06-15",
      code: "BOGOLABEL",
      isNew: false
    },
    {
      id: "OFF-003",
      title: "Free Printer Calibration",
      description: "Schedule a free printer calibration with any order over $500",
      expiryDate: "2024-06-30",
      code: "CALIBRATE",
      isNew: true
    }
  ];

  return (
    <ClientLayout>
      <h1 className="text-3xl font-bold mb-6">Special Offers</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockOffers.map((offer) => (
          <Card key={offer.id} className="h-full flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="mr-3">{offer.title}</CardTitle>
                {offer.isNew && (
                  <Badge className="bg-primary">New</Badge>
                )}
              </div>
              <CardDescription className="flex items-center mt-2">
                <Clock className="h-4 w-4 mr-1" />
                Expires: {new Date(offer.expiryDate).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p>{offer.description}</p>
              <div className="mt-4 p-2 bg-gray-100 rounded-md flex items-center">
                <Tag className="h-4 w-4 mr-2 text-primary" />
                <span className="font-mono text-sm">{offer.code}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Apply to Order</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </ClientLayout>
  );
};

export default ClientOffersPage;
