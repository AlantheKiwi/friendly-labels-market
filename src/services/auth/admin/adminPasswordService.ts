
// This file is now a barrel file that re-exports from the password directory
import { resetAdminPassword, forceResetAdminPassword } from "./password";

export {
  resetAdminPassword,
  forceResetAdminPassword
};
