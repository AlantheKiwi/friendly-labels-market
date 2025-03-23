
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLoginForm from "./AdminLoginForm";

interface AdminLoginCardProps {
  onLoginSuccess: () => void;
}

const AdminLoginCard: React.FC<AdminLoginCardProps> = ({ onLoginSuccess }) => {
  return (
    <Card className="border-2 border-gray-200 shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
        <CardDescription>
          Sign in to access the admin dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AdminLoginForm onLoginSuccess={onLoginSuccess} />
      </CardContent>
      <CardFooter className="text-center text-sm text-gray-500">
        <p className="w-full">
          This is a secure area. Unauthorized access is prohibited.
        </p>
      </CardFooter>
    </Card>
  );
};

export default AdminLoginCard;
