
import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, User, Users, ShoppingCart, FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const AdminHeader = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { adminEmail, logout } = useAdminAuth();

  return (
    <header className="bg-brand-blue text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Settings className="h-6 w-6" />
              <h1 className="text-xl font-bold">Service Labels Admin</h1>
            </div>
            
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="bg-brand-blue text-white">
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/20 focus:bg-white/20 data-[state=open]:bg-white/20">
                    CRM
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-white rounded-md shadow-lg p-2 w-[240px]">
                    <ul className="grid gap-1 p-1">
                      <ListItem href="/admin/clients" title="Clients" icon={<Users className="h-4 w-4" />}>
                        Manage customer information
                      </ListItem>
                      <ListItem href="/admin/orders" title="Orders" icon={<ShoppingCart className="h-4 w-4" />}>
                        Track and manage orders
                      </ListItem>
                      <ListItem href="/admin/quotes" title="Quotes" icon={<FileText className="h-4 w-4" />}>
                        Create and manage quotes
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="bg-transparent text-white hover:bg-white/20 focus:bg-white/20 data-[state=open]:bg-white/20 h-10 p-0 px-4 flex items-center gap-1"
                      >
                        <Printer className="h-4 w-4 mr-1" />
                        Printers
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white rounded-md shadow-lg p-2 w-[200px]">
                      <DropdownMenuItem onClick={() => navigate('/admin/dashboard?tab=printers')} className="flex items-center gap-2 cursor-pointer">
                        <Printer className="h-4 w-4" />
                        <span>Printer Pricing</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/admin/dashboard?tab=images')} className="flex items-center gap-2 cursor-pointer">
                        <FileText className="h-4 w-4" />
                        <span>Printer Images</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">{adminEmail}</span>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={logout}
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

// Component for the navigation menu items
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { 
    icon?: React.ReactNode;
    title: string;
  }
>(({ className, title, icon, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2 text-sm font-medium leading-none">
            {icon}
            <span>{title}</span>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default AdminHeader;
