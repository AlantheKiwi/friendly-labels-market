
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
    ADMIN_EMAIL,
    setIsLoading,
    authService
  } = props;

  // Use the more focused hooks
  const loginFlow = useAdminLoginFlow(props);
  const passwordReset = useAdminPasswordReset({
    email,
    ADMIN_EMAIL,
    setIsLoading,
    setErrorMessage: props.setErrorMessage,
    authService
  });

  const handleLogin = async (e: React.FormEvent) => {
    return await loginFlow.handleLogin(e);
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
    return await passwordReset.resetAdminPassword();
  };

  return {
    handleLogin,
    handleForgotPassword,
    handleResetAdminPassword
  };
};
