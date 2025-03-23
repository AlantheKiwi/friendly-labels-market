
import React from "react";

interface LoginErrorMessageProps {
  message: string;
}

const LoginErrorMessage: React.FC<LoginErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  
  return <p className="text-sm text-red-500">{message}</p>;
};

export default LoginErrorMessage;
