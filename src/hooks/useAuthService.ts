
import { DEFAULT_ADMIN_PASSWORD, ADMIN_EMAIL } from "@/services/auth/constants";
import * as authService from "@/services/auth/authService";
import * as adminService from "@/services/auth/adminService";

// This hook provides access to all auth service functionality
export const useAuthService = () => {
  return {
    // Core auth methods
    signInWithPassword: authService.signInWithPassword,
    signUp: authService.signUp,
    signOut: authService.signOut,
    getUser: authService.getUser,
    getSession: authService.getSession,
    checkUserRoles: authService.checkUserRoles,
    
    // Admin-specific methods
    createAdminIfNotExists: adminService.createAdminIfNotExists,
    forceResetAdminPassword: adminService.forceResetAdminPassword,
    
    // Export constants for use in UI
    DEFAULT_ADMIN_PASSWORD,
    ADMIN_EMAIL
  };
};
