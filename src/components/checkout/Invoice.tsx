
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Printer, Mail, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface OrderData {
  orderNumber: string;
  orderDate: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    postalCode: string;
  };
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    dimensions?: string;
  }[];
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  gst: number;
  total: number;
}

interface InvoiceProps {
  orderData: OrderData;
}

const Invoice: React.FC<InvoiceProps> = ({ orderData }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    documentTitle: `Invoice-${orderData.orderNumber}`,
    onPrintError: (error) => console.error('Print failed', error),
    contentRef: invoiceRef,
  });

  const handleEmail = () => {
    // In a real application, this would make an API call to send the invoice
    // For now, we'll just show a toast
    toast({
      title: "Invoice Sent",
      description: `Invoice has been sent to ${orderData.customerInfo.email}`,
    });
  };

  const handleDownload = () => {
    // This would generate a PDF for download in a real application
    // For now, just show a toast
    toast({
      title: "Invoice Downloaded",
      description: "Your invoice has been downloaded as a PDF",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Invoice</h2>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handlePrint()}
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

          <div ref={invoiceRef} className="p-4">
            <div className="flex justify-between mb-8">
              <div>
                <h3 className="font-semibold text-lg">Service Labels NZ</h3>
                <p>Unit 2/1 Doric Way</p>
                <p>Islington, Christchurch</p>
                <p>New Zealand</p>
                <p>Phone: 022 657 8662</p>
                <p>Email: sales@servicelabels.co.nz</p>
              </div>
              <div className="text-right">
                <h3 className="font-semibold text-lg">Invoice</h3>
                <p>Invoice #: {orderData.orderNumber}</p>
                <p>Date: {orderData.orderDate}</p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="font-semibold mb-2">Bill To:</h4>
                <p>{orderData.customerInfo.firstName} {orderData.customerInfo.lastName}</p>
                {orderData.customerInfo.company && <p>{orderData.customerInfo.company}</p>}
                <p>{orderData.customerInfo.email}</p>
                <p>{orderData.customerInfo.phone}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Ship To:</h4>
                <p>{orderData.customerInfo.address1}</p>
                {orderData.customerInfo.address2 && <p>{orderData.customerInfo.address2}</p>}
                <p>{orderData.customerInfo.city}, {orderData.customerInfo.postalCode}</p>
                <p>New Zealand</p>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderData.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {item.productName}
                      {item.dimensions && <span className="text-sm text-gray-500 block">{item.dimensions}</span>}
                    </TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${(item.quantity * item.price).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3} className="text-right">Subtotal (Ex GST)</TableCell>
                  <TableCell className="text-right">${orderData.subtotal.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="text-right">Shipping</TableCell>
                  <TableCell className="text-right">${orderData.shipping.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="text-right">GST (15%)</TableCell>
                  <TableCell className="text-right">${orderData.gst.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-semibold">Total (Inc GST)</TableCell>
                  <TableCell className="text-right font-semibold">${orderData.total.toFixed(2)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>

            <div className="mt-8 text-center text-sm text-gray-500">
              <p>Thank you for your business with Service Labels NZ!</p>
              <p>Website: <a href="https://www.servicelabels.co.nz" className="text-blue-600">www.servicelabels.co.nz</a></p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Invoice;
