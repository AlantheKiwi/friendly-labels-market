
import React from "react";
import { Button } from "@/components/ui/button";
import { Printer, Mail, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface InvoiceHeaderProps {
  orderNumber: string;
  handlePrint: () => void;
  customerEmail: string;
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ orderNumber, handlePrint, customerEmail }) => {
  const handleEmail = () => {
    // In a real application, this would make an API call to send the invoice
    toast({
      title: "Invoice Sent",
      description: `Invoice has been sent to ${customerEmail}`,
    });
  };

  const handleDownload = () => {
    // This would generate a PDF for download in a real application
    toast({
      title: "Invoice Downloaded",
      description: "Your invoice has been downloaded as a PDF",
    });
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Invoice</h2>
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handlePrint}
          className="flex items-center"
        >
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleEmail}
          className="flex items-center"
        >
          <Mail className="h-4 w-4 mr-2" />
          Email
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDownload}
          className="flex items-center"
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>
    </div>
  );
};

export default InvoiceHeader;
