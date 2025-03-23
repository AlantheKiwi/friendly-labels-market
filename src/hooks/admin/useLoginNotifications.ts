
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
      description: `Could not log in. Please try with the default password: ${DEFAULT_ADMIN_PASSWORD}`,
      variant: "destructive",
    });
  };

  return {
    handleInvalidEmail,
    handleAllLoginAttemptsFailed
  };
};
