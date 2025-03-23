
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { Printer } from "@/types";
import { PauseCircle, Edit, Trash2, Save, Loader2 } from "lucide-react";

interface PrinterTableProps {
  filteredPrinters: Printer[];
  editedPrices: Record<number, { price: number }>;
  savingIds: number[];
  handlePriceChange: (printerId: number, value: string) => void;
  handleSavePrice: (printerId: number) => void;
  handleEditPrinter: (printer: Printer) => void;
  handleDeletePrinter: (printer: Printer) => void;
  handleSuspendPrinter: (printer: Printer) => void;
  handleSuspendAllPrinters: () => void;
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
  handleSuspendPrinter,
  handleSuspendAllPrinters,
  isPriceEdited,
  isSaving,
}) => {
  return (
    <div className="space-y-4">
      {filteredPrinters.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">No printers found</p>
        </div>
      ) : (
        <>
          <div className="flex justify-end space-x-2 mb-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={handleSuspendAllPrinters}
            >
              <PauseCircle className="h-4 w-4" />
              Suspend All Printers
            </Button>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Model</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[180px]">Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrinters.map((printer) => (
                  <TableRow key={printer.id} className={printer.suspended ? "bg-gray-100" : ""}>
                    <TableCell>
                      <div className="font-medium">{printer.name}</div>
                    </TableCell>
                    <TableCell>
                      {printer.suspended ? (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          Suspended
                        </Badge>
                      ) : printer.contactForPrice ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Contact for Price
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Active
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Input
                          value={
                            isPriceEdited(printer.id)
                              ? editedPrices[printer.id]?.price
                              : printer.price
                          }
                          onChange={(e) => handlePriceChange(printer.id, e.target.value)}
                          className="max-w-[120px]"
                          disabled={printer.contactForPrice}
                        />
                        {isPriceEdited(printer.id) && (
                          <Button
                            size="sm"
                            onClick={() => handleSavePrice(printer.id)}
                            disabled={isSaving(printer.id)}
                          >
                            {isSaving(printer.id) ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditPrinter(printer)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSuspendPrinter(printer)}
                          className={printer.suspended ? "text-yellow-500 hover:text-yellow-700" : ""}
                        >
                          <PauseCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePrinter(printer)}
                          className="text-red-500 hover:text-red-700"
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
        </>
      )}
    </div>
  );
};

export default PrinterTable;
