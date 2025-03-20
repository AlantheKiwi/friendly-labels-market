
import React from "react";
import { Separator } from "@/components/ui/separator";

interface InvoiceInfoProps {
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
}

const InvoiceInfo: React.FC<InvoiceInfoProps> = ({ orderNumber, orderDate, customerInfo }) => {
  return (
    <>
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
          <p>Invoice #: {orderNumber}</p>
          <p>Date: {orderDate}</p>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h4 className="font-semibold mb-2">Bill To:</h4>
          <p>{customerInfo.firstName} {customerInfo.lastName}</p>
          {customerInfo.company && <p>{customerInfo.company}</p>}
          <p>{customerInfo.email}</p>
          <p>{customerInfo.phone}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Ship To:</h4>
          <p>{customerInfo.address1}</p>
          {customerInfo.address2 && <p>{customerInfo.address2}</p>}
          <p>{customerInfo.city}, {customerInfo.postalCode}</p>
          <p>New Zealand</p>
        </div>
      </div>
    </>
  );
};

export default InvoiceInfo;
