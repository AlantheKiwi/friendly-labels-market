
import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const AdminHeader = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const adminEmail = localStorage.getItem("adminEmail") || "Admin";

  const handleLogout = () => {
    // Clear admin session
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminEmail");
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    
    navigate("/");
  };

  return (
    <header className="bg-brand-blue text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Settings className="h-6 w-6" />
            <h1 className="text-xl font-bold">Service Labels Admin</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">{adminEmail}</span>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="bg-white/10 hover:bg-white/20 border-white/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
