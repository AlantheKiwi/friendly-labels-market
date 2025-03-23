
import { useAdminLoginFlow } from "./useAdminLoginFlow";
import { useAdminPasswordReset } from "./useAdminPasswordReset";

interface UseAdminLoginAuthProps {
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

export const useAdminLoginAuth = (props: UseAdminLoginAuthProps) => {
  const {
    email,
    password,
    ADMIN_EMAIL,
    setIsLoading,
    authService
  } = props;

  // Use the more focused hooks
  const loginFlow = useAdminLoginFlow(props);
  const passwordReset = useAdminPasswordReset(props);

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
        const defaultLoginSuccess = await loginFlow.attemptLoginWithDefaultPassword();
        if (defaultLoginSuccess) {
          setIsLoading(false);
          return;
        }
        
        // Try login with entered password
        const userPasswordLoginSuccess = await loginFlow.attemptLoginWithEnteredPassword();
        if (userPasswordLoginSuccess) {
          setIsLoading(false);
          return;
        }
        
        // Try admin account setup
        const adminSetupSuccess = await loginFlow.attemptAdminAccountSetup();
        if (adminSetupSuccess) {
          setIsLoading(false);
          return;
        }
        
        // All attempts failed
        loginFlow.handleAllLoginAttemptsFailed();
      } else {
        // Not the admin email - reject
        loginFlow.handleInvalidEmail();
      }
    } catch (err) {
      console.error("Login error:", err);
      props.setErrorMessage("An unexpected error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!passwordReset.validateEmailForReset()) {
      return;
    }

    setIsLoading(true);
    try {
      await passwordReset.sendPasswordResetEmail();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAdminPassword = async () => {
    return await loginFlow.resetAdminPassword();
  };

  return {
    handleLogin,
    handleForgotPassword,
    handleResetAdminPassword
  };
};
