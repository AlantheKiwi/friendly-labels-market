
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  dimensions?: string;
}

interface InvoiceTableProps {
  items: InvoiceItem[];
  subtotal: number;
  shipping: number;
  gst: number;
  total: number;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ items, subtotal, shipping, gst, total }) => {
  return (
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
        {items.map((item, index) => (
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
          <TableCell className="text-right">${subtotal.toFixed(2)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={3} className="text-right">Shipping</TableCell>
          <TableCell className="text-right">${shipping.toFixed(2)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={3} className="text-right">GST (15%)</TableCell>
          <TableCell className="text-right">${gst.toFixed(2)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={3} className="text-right font-semibold">Total (Inc GST)</TableCell>
          <TableCell className="text-right font-semibold">${total.toFixed(2)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default InvoiceTable;
