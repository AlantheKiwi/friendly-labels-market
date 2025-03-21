
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Package2, Receipt, FileText, Bell, 
  MessageSquare, Home, LogOut 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const ClientSidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  
  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      path: "/client/dashboard",
    },
    {
      title: "Orders",
      icon: Package2,
      path: "/client/orders",
    },
    {
      title: "Invoices",
      icon: Receipt,
      path: "/client/invoices",
    },
    {
      title: "Offers",
      icon: Bell,
      path: "/client/offers",
    },
    {
      title: "Notes",
      icon: FileText,
      path: "/client/notes",
    },
    {
      title: "Queries",
      icon: MessageSquare,
      path: "/client/queries",
    },
  ];
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  return (
    <div className="h-screen w-64 bg-gray-100 border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-primary">Client Portal</h2>
      </div>
      
      <nav className="flex-grow p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  location.pathname === item.path 
                    ? "bg-primary text-primary-foreground" 
                    : "text-gray-700 hover:bg-gray-200"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2 justify-center"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default ClientSidebar;
