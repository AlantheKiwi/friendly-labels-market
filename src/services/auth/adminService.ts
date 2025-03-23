
// This file now serves as a barrel file to re-export admin functionality from submodules
import { createAdminIfNotExists } from "./admin/adminCreationService";
import { resetAdminPassword, forceResetAdminPassword } from "./admin/adminPasswordService";

// Re-export all admin-related functions
export {
  createAdminIfNotExists,
  resetAdminPassword,
  forceResetAdminPassword
};
