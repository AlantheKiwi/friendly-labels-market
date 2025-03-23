
import { useToast } from "@/components/ui/use-toast";
import { usePasswordValidation } from "./usePasswordValidation";
import { useLoginAttempts } from "./useLoginAttempts";
import { useAdminSetup } from "./useAdminSetup";
import { useLoginNotifications } from "./useLoginNotifications";

interface UseAdminLoginFlowProps {
  email: string;
  password: string;
  ADMIN_EMAIL: string;
  DEFAULT_ADMIN_PASSWORD: string;
  setIsLoading: (isLoading: boolean) => void;
  setIsCreatingAdmin: (isCreatingAdmin: boolean) => void;
  setErrorMessage: (errorMessage: string) => void;
  authService: any; // Using any here since we don't have the exact type definition
  onLoginSuccess: () => void;
}

export const useAdminLoginFlow = (props: UseAdminLoginFlowProps) => {
  const {
    email,
    password,
    ADMIN_EMAIL,
    setIsLoading,
    authService
  } = props;

  // Use the password validation hook
  const { comparePasswords } = usePasswordValidation();

  // Use the login attempts hook
  const { 
    attemptLoginWithDefaultPassword, 
    attemptLoginWithEnteredPassword 
  } = useLoginAttempts({
    ...props,
    comparePasswords
  });

  // Use the admin setup hook
  const { attemptAdminAccountSetup } = useAdminSetup({
    ADMIN_EMAIL,
    setIsCreatingAdmin: props.setIsCreatingAdmin,
    setErrorMessage: props.setErrorMessage,
    authService,
    onLoginSuccess: props.onLoginSuccess
  });

  // Use the login notifications hook
  const {
    handleInvalidEmail,
    handleAllLoginAttemptsFailed
  } = useLoginNotifications({
    email,
    ADMIN_EMAIL,
    DEFAULT_ADMIN_PASSWORD: props.DEFAULT_ADMIN_PASSWORD,
    setErrorMessage: props.setErrorMessage
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    props.setErrorMessage("");

    try {
      console.log("Starting admin login process with email:", email);
      
      // Log the actual credentials being used (mask the password)
      console.log("ADMIN_EMAIL from props:", ADMIN_EMAIL);
      console.log("DEFAULT_PASSWORD length:", props.DEFAULT_ADMIN_PASSWORD.length);
      
      // Normalize email to lowercase for consistency
      const normalizedEmail = email.toLowerCase().trim();
      
      // Check if this is the admin email
      const isAdminEmail = normalizedEmail === ADMIN_EMAIL.toLowerCase().trim();
      
      if (isAdminEmail) {
        console.log("Admin login attempt detected");
        
        // Try login with default password first
        const defaultLoginSuccess = await attemptLoginWithDefaultPassword();
        if (defaultLoginSuccess) {
          setIsLoading(false);
          return;
        }
        
        // Try login with entered password
        const userPasswordLoginSuccess = await attemptLoginWithEnteredPassword();
        if (userPasswordLoginSuccess) {
          setIsLoading(false);
          return;
        }
        
        // Try admin account setup
        const adminSetupSuccess = await attemptAdminAccountSetup();
        if (adminSetupSuccess) {
          setIsLoading(false);
          return;
        }
        
        // All attempts failed
        handleAllLoginAttemptsFailed();
      } else {
        // Not the admin email - reject
        handleInvalidEmail();
      }
    } catch (err) {
      console.error("Login error:", err);
      props.setErrorMessage("An unexpected error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    attemptLoginWithDefaultPassword,
    attemptLoginWithEnteredPassword,
    attemptAdminAccountSetup,
    resetAdminPassword: props.authService.resetAdminPassword,
    handleInvalidEmail,
    handleAllLoginAttemptsFailed,
    handleLogin
  };
};
