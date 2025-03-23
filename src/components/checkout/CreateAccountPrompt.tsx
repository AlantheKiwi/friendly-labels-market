
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { CheckCircle, HelpCircle, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CreateAccountPromptProps {
  email: string;
  firstName: string;
  lastName: string;
}

const CreateAccountPrompt: React.FC<CreateAccountPromptProps> = ({ email, firstName, lastName }) => {
  const { user } = useAuth();
  const [receiveUpdates, setReceiveUpdates] = useState(true);
  const navigate = useNavigate();
  
  // Skip if user is already logged in
  if (user) return null;
  
  const handleCreateAccount = () => {
    navigate("/auth/register", { 
      state: { 
        fromCheckout: true, 
        email, 
        firstName, 
        lastName,
        receiveUpdates
      } 
    });
    
    toast({
      title: "Redirecting to registration",
      description: "We'll save your information for a faster checkout next time"
    });
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 mt-6">
      <div className="flex items-center gap-3">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <h3 className="text-lg font-medium">Create an account for easier re-ordering</h3>
      </div>
      
      <div className="pl-8 mt-3">
        <p className="text-gray-600 mb-4">
          Set up an account to save your details for faster checkout in the future, 
          track your orders, and get access to special offers.
        </p>
        
        <div className="flex items-center space-x-2 mb-4">
          <Switch
            id="receive-updates"
            checked={receiveUpdates}
            onCheckedChange={setReceiveUpdates}
          />
          <div className="flex items-center">
            <Label htmlFor="receive-updates" className="mr-1">Receive updates about new products and offers</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full p-0">
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                  <span className="sr-only">More info</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <p className="text-sm">
                  We'll occasionally send you information about new products, 
                  special offers, and industry news. You can unsubscribe at any time.
                </p>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <Button onClick={handleCreateAccount} className="flex items-center">
          <Mail className="mr-2 h-4 w-4" />
          Create account with {email}
        </Button>
      </div>
    </div>
  );
};

export default CreateAccountPrompt;
