
import { useToast } from "@/components/ui/use-toast";

interface UseLoginNotificationsProps {
  email: string;
  ADMIN_EMAIL: string;
  DEFAULT_ADMIN_PASSWORD: string;
  setErrorMessage: (message: string) => void;
}

export const useLoginNotifications = ({
  email,
  ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
  setErrorMessage
}: UseLoginNotificationsProps) => {
  const { toast } = useToast();

  const handleInvalidEmail = () => {
    setErrorMessage("You do not have administrator privileges");
    toast({
      title: "Access denied",
      description: "You do not have administrator privileges",
      variant: "destructive",
    });
  };

  const handleAllLoginAttemptsFailed = () => {
    // Log details about what we know at this point
    console.log("All login attempts failed with email:", email);
    console.log("Default admin email:", ADMIN_EMAIL);
    console.log("Default admin password:", DEFAULT_ADMIN_PASSWORD.replace(/./g, "*"));
    
    setErrorMessage(`Could not log in. Please try again with the default password: ${DEFAULT_ADMIN_PASSWORD}`);
    toast({
      title: "Login failed",
      description: `Could not log in. Try using the "Reset Admin Password" button below or use the default password: ${DEFAULT_ADMIN_PASSWORD}`,
      variant: "destructive",
    });
  };

  const handleNetworkError = (error: Error) => {
    console.error("Network error during login:", error);
    setErrorMessage("Connection error. Please check your internet connection and try again.");
    toast({
      title: "Connection error",
      description: "Please check your internet connection and try again.",
      variant: "destructive",
    });
  };

  const handleAuthenticationError = (errorMessage: string) => {
    console.error("Authentication error:", errorMessage);
    setErrorMessage(`Authentication error: ${errorMessage}`);
    toast({
      title: "Authentication error",
      description: errorMessage,
      variant: "destructive",
    });
  };

  const handleUnexpectedError = (error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Unexpected error during login:", error);
    setErrorMessage(`An unexpected error occurred: ${errorMessage}`);
    toast({
      title: "Error",
      description: "An unexpected error occurred. Please try again later or use the reset button below.",
      variant: "destructive",
    });
  };

  return {
    handleInvalidEmail,
    handleAllLoginAttemptsFailed,
    handleNetworkError,
    handleAuthenticationError,
    handleUnexpectedError
  };
};
