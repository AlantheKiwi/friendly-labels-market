
import React from 'react';
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { FileText, Package, MessageSquare, User } from "lucide-react";

const AuthenticatedView = () => {
  const { user, signOut } = useAuth();

  if (!user) {
    return null;
  }

  const firstName = user.user_metadata?.first_name || '';
  const lastName = user.user_metadata?.last_name || '';
  const displayName = firstName && lastName 
    ? `${firstName} ${lastName}` 
    : user.email;

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
        <h3 className="font-medium text-blue-800 mb-1">Welcome, {displayName}!</h3>
        <p className="text-sm text-blue-700">
          You're signed in with {user.email}
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <Link to="/client/orders" className="w-full">
          <Button variant="outline" className="w-full justify-start">
            <Package className="mr-2 h-4 w-4" />
            My Orders
          </Button>
        </Link>
        
        <Link to="/client/invoices" className="w-full">
          <Button variant="outline" className="w-full justify-start">
            <FileText className="mr-2 h-4 w-4" />
            Invoices
          </Button>
        </Link>
        
        <Link to="/client/queries" className="w-full">
          <Button variant="outline" className="w-full justify-start">
            <MessageSquare className="mr-2 h-4 w-4" />
            Queries
          </Button>
        </Link>
        
        <Link to="/client/dashboard" className="w-full">
          <Button variant="outline" className="w-full justify-start">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </Link>
      </div>
      
      <Button 
        variant="ghost" 
        className="w-full text-gray-600 hover:text-gray-900" 
        onClick={() => signOut()}
      >
        Sign Out
      </Button>
    </div>
  );
};

export default AuthenticatedView;
