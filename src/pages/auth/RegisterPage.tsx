
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RegisterForm from "@/components/auth/RegisterForm";
import RegisterSuccessScreen from "@/components/auth/RegisterSuccessScreen";
import { useRegister } from "@/hooks/useRegister";

interface LocationState {
  fromCheckout?: boolean;
  email?: string;
  firstName?: string;
  lastName?: string;
  receiveUpdates?: boolean;
}

const RegisterPage = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  
  const [email, setEmail] = useState(state?.email || "");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState(state?.firstName || "");
  const [lastName, setLastName] = useState(state?.lastName || "");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isLoading, registrationComplete, registerUser } = useRegister();

  useEffect(() => {
    if (user) {
      // If coming from checkout, redirect back to checkout
      if (state?.fromCheckout) {
        navigate("/checkout");
      } else {
        navigate("/client/dashboard");
      }
    }
  }, [user, navigate, state?.fromCheckout]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await registerUser(email, password, firstName, lastName, company, phone);
  };

  // If registration is complete, show the success screen
  if (registrationComplete) {
    return <RegisterSuccessScreen firstName={firstName} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12">
        <div className="w-full max-w-md px-4">
          <Card className="border-2 border-gray-200 shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Register</CardTitle>
              <CardDescription>
                {state?.fromCheckout 
                  ? "Create an account for faster checkout and special offers" 
                  : "Create a new account"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RegisterForm 
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                company={company}
                setCompany={setCompany}
                phone={phone}
                setPhone={setPhone}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                isLoading={isLoading}
                onSubmit={handleRegister}
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <div className="text-center text-sm">
                <span className="text-gray-500">Already have an account? </span>
                <Link to="/auth/login" className="text-blue-600 hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RegisterPage;
