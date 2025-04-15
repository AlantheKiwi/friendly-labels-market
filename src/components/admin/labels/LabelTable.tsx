
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface Label {
  id: string;
  name: string;
  sku: string | null;
  base_price: number;
  material: string;
  finish: string;
  stock_quantity: number;
  active: boolean;
}

interface LabelTableProps {
  labels: Label[];
  onEdit: (label: Label) => void;
  onDelete: (label: Label) => void;
}

const LabelTable: React.FC<LabelTableProps> = ({ labels, onEdit, onDelete }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Material</TableHead>
            <TableHead>Finish</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {labels.map((label) => (
            <TableRow key={label.id}>
              <TableCell>{label.name}</TableCell>
              <TableCell>{label.sku || '-'}</TableCell>
              <TableCell>{formatCurrency(label.base_price)}</TableCell>
              <TableCell className="capitalize">{label.material}</TableCell>
              <TableCell className="capitalize">{label.finish.replace('_', ' ')}</TableCell>
              <TableCell>{label.stock_quantity}</TableCell>
              <TableCell>
                <Badge variant={label.active ? "success" : "secondary"}>
                  {label.active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(label)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(label)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LabelTable;
