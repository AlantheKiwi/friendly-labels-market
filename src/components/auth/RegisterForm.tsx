
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, UserPlus } from "lucide-react";

interface RegisterFormProps {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  company: string;
  setCompany: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  company,
  setCompany,
  phone,
  setPhone,
  email,
  setEmail,
  password,
  setPassword,
  isLoading,
  onSubmit
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={toggleShowPassword}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            Creating account...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <UserPlus className="mr-2 h-4 w-4" /> Register
          </span>
        )}
      </Button>
    </form>
  );
};

export default RegisterForm;
