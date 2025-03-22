
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const MainNav: React.FC = () => {
  const { user, isClient } = useAuth();

  return (
    <nav className="hidden md:flex items-center space-x-8">
      <Link to="/" className="font-medium hover:text-brand-blue transition-colors">
        Home
      </Link>
      <Link to="/products" className="font-medium hover:text-brand-blue transition-colors">
        Products
      </Link>
      <Link to="/printers" className="font-medium hover:text-brand-blue transition-colors">
        Printers
      </Link>
      
      {/* Only show client portal dropdown if user is logged in and has client role */}
      {user && isClient && (
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="font-medium hover:text-brand-blue transition-colors bg-transparent">Client Portal</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-1 p-2">
                  <ListItem href="/client/dashboard" title="Dashboard" />
                  <ListItem href="/client/orders" title="Orders" />
                  <ListItem href="/client/invoices" title="Invoices" />
                  <ListItem href="/client/offers" title="Special Offers" />
                  <ListItem href="/client/queries" title="My Queries" />
                  <ListItem href="/client/notes" title="Notes" />
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )}
      
      <Link to="/contact" className="font-medium hover:text-brand-blue transition-colors">
        Contact
      </Link>
    </nav>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string }
>(({ className, title, children, ...props }, ref) => {
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
          <div className="text-sm font-medium leading-none">{title}</div>
          {children && <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>}
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default MainNav;
