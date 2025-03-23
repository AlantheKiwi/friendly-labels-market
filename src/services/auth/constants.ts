
import { checkDefaultPasswordEncoding } from "@/utils/passwordDebugUtils";

// Default admin credentials - centralized for consistency
export const DEFAULT_ADMIN_PASSWORD = "letmein1983!!";
export const ADMIN_EMAIL = "alan@insight-ai-systems.com";

// Run password encoding check on import to identify any issues
if (process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    console.log("Checking default password encoding...");
    const result = checkDefaultPasswordEncoding(DEFAULT_ADMIN_PASSWORD);
    if (result.hasIssues) {
      console.warn("⚠️ Default password has encoding issues:", result.issues);
      console.warn("This may cause login problems with the default password");
    } else {
      console.log("✅ Default password encoding looks good");
    }
  }, 0);
}
