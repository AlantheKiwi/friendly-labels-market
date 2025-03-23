
import React from "react";
import { Printer } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, Check, Pencil, Trash2 } from "lucide-react";

interface PrinterTableProps {
  filteredPrinters: Printer[];
  editedPrices: Record<number, { price: number }>;
  savingIds: number[];
  handlePriceChange: (printerId: number, value: string) => void;
  handleSavePrice: (printerId: number) => void;
  handleEditPrinter: (printer: Printer) => void;
  handleDeletePrinter: (printer: Printer) => void;
  isPriceEdited: (printerId: number) => boolean;
  isSaving: (printerId: number) => boolean;
}

const PrinterTable: React.FC<PrinterTableProps> = ({
  filteredPrinters,
  editedPrices,
  savingIds,
  handlePriceChange,
  handleSavePrice,
  handleEditPrinter,
  handleDeletePrinter,
  isPriceEdited,
  isSaving,
}) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">ID</TableHead>
            <TableHead>Printer Name</TableHead>
            <TableHead className="w-40">Price (NZD)</TableHead>
            <TableHead className="w-32">Status</TableHead>
            <TableHead className="w-40">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPrinters.length > 0 ? (
            filteredPrinters.map((printer) => (
              <TableRow key={printer.id}>
                <TableCell className="font-medium">{printer.id}</TableCell>
                <TableCell>
                  <div className="font-medium">{printer.name}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {printer.description.substring(0, 50)}...
                  </div>
                </TableCell>
                <TableCell>
                  {printer.contactForPrice ? (
                    <Badge variant="outline">Contact for Price</Badge>
                  ) : (
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        editedPrices[printer.id]?.price !== undefined
                          ? editedPrices[printer.id].price
                          : printer.price
                      }
                      onChange={(e) => 
                        handlePriceChange(printer.id, e.target.value)
                      }
                    />
                  )}
                </TableCell>
                <TableCell>
                  {printer.contactForPrice && (
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                      Contact Only
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleSavePrice(printer.id)}
                      disabled={!isPriceEdited(printer.id) || isSaving(printer.id) || printer.contactForPrice}
                    >
                      {isSaving(printer.id) ? (
                        <span className="h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-1"></span>
                      ) : isPriceEdited(printer.id) ? (
                        <Save className="h-3.5 w-3.5 mr-1" />
                      ) : (
                        <Check className="h-3.5 w-3.5 mr-1" />
                      )}
                      {isSaving(printer.id)
                        ? "Saving"
                        : isPriceEdited(printer.id)
                        ? "Save"
                        : "Saved"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditPrinter(printer)}
                    >
                      <Pencil className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                      onClick={() => handleDeletePrinter(printer)}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24 text-gray-500">
                No printers found matching your search.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PrinterTable;
