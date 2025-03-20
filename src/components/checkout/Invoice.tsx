
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Card, CardContent } from "@/components/ui/card";
import InvoiceHeader from "./InvoiceHeader";
import InvoiceInfo from "./InvoiceInfo";
import InvoiceTable from "./InvoiceTable";
import InvoiceFooter from "./InvoiceFooter";

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

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <InvoiceHeader 
            orderNumber={orderData.orderNumber} 
            handlePrint={() => handlePrint()} 
            customerEmail={orderData.customerInfo.email}
          />

          <div ref={invoiceRef} className="p-4">
            <InvoiceInfo
              orderNumber={orderData.orderNumber}
              orderDate={orderData.orderDate}
              customerInfo={orderData.customerInfo}
            />

            <InvoiceTable
              items={orderData.items}
              subtotal={orderData.subtotal}
              shipping={orderData.shipping}
              gst={orderData.gst}
              total={orderData.total}
            />

            <InvoiceFooter />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Invoice;
