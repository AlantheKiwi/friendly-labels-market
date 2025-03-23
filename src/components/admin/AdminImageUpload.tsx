
import React, { useState, useEffect } from "react";
import { Upload, X, Check, Image as ImageIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { printers as defaultPrinters } from "@/data/printerData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Printer } from "@/types";

const AdminImageUpload = () => {
  const [selectedPrinterId, setSelectedPrinterId] = useState<string>("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [printers, setPrinters] = useState<Printer[]>([]);
  const { toast } = useToast();

  // Load current printers from localStorage
  useEffect(() => {
    const loadPrinters = () => {
      const storedPrinters = localStorage.getItem('printers');
      if (storedPrinters) {
        setPrinters(JSON.parse(storedPrinters));
      } else {
        setPrinters(defaultPrinters);
      }
    };
    
    loadPrinters();
    
    // Listen for storage events to update the printer list if it changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'printers') {
        loadPrinters();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handlePrinterChange = (value: string) => {
    setSelectedPrinterId(value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast({
          title: "Invalid file format",
          description: "Please upload JPG, PNG, or WEBP images only",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setUploadedImage(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const handleUpload = () => {
    if (!selectedPrinterId) {
      toast({
        title: "No printer selected",
        description: "Please select a printer first",
        variant: "destructive",
      });
      return;
    }
    
    if (!uploadedImage) {
      toast({
        title: "No image selected",
        description: "Please select an image to upload",
        variant: "destructive",
      });
      return;
    }
    
    setUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setUploading(false);
      toast({
        title: "Upload successful",
        description: "The image has been uploaded successfully",
      });
      
      // Clear form
      setUploadedImage(null);
      setImagePreview(null);
      setSelectedPrinterId("");
    }, 2000);
  };

  const clearImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    
    // Also revoke the object URL to prevent memory leaks
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">1. Select Printer</h3>
            <Select 
              value={selectedPrinterId} 
              onValueChange={handlePrinterChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a printer" />
              </SelectTrigger>
              <SelectContent>
                {printers
                  .filter(printer => !printer.suspended) // Only show non-suspended printers
                  .map((printer) => (
                    <SelectItem key={printer.id} value={printer.id.toString()}>
                      {printer.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">2. Upload Image</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                </div>
                {uploadedImage && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={clearImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="text-sm text-gray-500 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>Supported formats: JPG, PNG, WEBP. Max size: 5MB</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 mt-6">
            <Button
              type="button"
              onClick={handleUpload}
              disabled={!uploadedImage || !selectedPrinterId || uploading}
              className="flex-1"
            >
              {uploading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </>
              )}
            </Button>
            
            {imagePreview && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPreviewDialog(true)}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Preview
              </Button>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Image Preview</h3>
          <Card className="border-2 border-dashed rounded-lg overflow-hidden flex items-center justify-center" style={{ height: "300px" }}>
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Printer preview"
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="text-center p-6 text-gray-400">
                <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                <p>No image selected</p>
                <p className="text-sm">Select a printer and upload an image to see a preview</p>
              </div>
            )}
          </Card>
        </div>
      </div>
      
      {/* Image Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
            <DialogDescription>
              This is how the image will appear when uploaded.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center justify-center mt-4 max-h-[60vh] overflow-hidden">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Full size preview"
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminImageUpload;
