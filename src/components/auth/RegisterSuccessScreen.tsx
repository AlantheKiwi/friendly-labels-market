
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface RegisterSuccessScreenProps {
  firstName: string;
}

const RegisterSuccessScreen: React.FC<RegisterSuccessScreenProps> = ({ firstName }) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12">
        <div className="w-full max-w-md px-4">
          <Card className="border-2 border-gray-200 shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-2">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl font-bold">Registration Successful!</CardTitle>
              <CardDescription>
                Your client account has been created
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p>Thank you for registering, {firstName}!</p>
              <p>You now have access to your client portal where you can view invoices, orders, and more.</p>
              <p className="font-medium">Please log in to continue.</p>
            </CardContent>
            <CardFooter className="flex justify-center pb-6">
              <Button 
                className="w-full max-w-xs" 
                onClick={() => navigate("/auth/login")}
              >
                Go to Login
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RegisterSuccessScreen;
