
import { useCallback, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { UserRoles } from "@/types/auth";

export const useRoleCheck = (
  isAdmin: boolean, 
  isClient: boolean, 
  user: any, 
  setIsAdmin: (value: boolean) => void,
  setIsClient: (value: boolean) => void,
  setIsLoading: (value: boolean) => void,
  setLastRoleCheck: (value: number) => void
) => {
  const { toast } = useToast();
  const roleCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const roleCheckInProgressRef = useRef<boolean>(false);

  // Helper function to check roles with improved logic - memoized to prevent recreation
  const checkRolesWithTimeout = useCallback(async (userId: string): Promise<UserRoles> => {
    // If no userId is provided, return default roles
    if (!userId) {
      console.log("No user ID provided for role check");
      setIsLoading(false);
      return { isAdmin: false, isClient: false };
    }
    
    console.log("Starting role check with timeout for user:", userId);
    
    // Prevent concurrent role checks for the same user
    if (roleCheckInProgressRef.current) {
      console.log("Role check already in progress, using cached values");
      return { isAdmin, isClient };
    }
    
    roleCheckInProgressRef.current = true;
    
    // Clear any existing timeout to prevent race conditions
    if (roleCheckTimeoutRef.current) {
      clearTimeout(roleCheckTimeoutRef.current);
      roleCheckTimeoutRef.current = null;
    }
    
    // Set a timeout to ensure loading state is eventually set to false even if role check fails
    roleCheckTimeoutRef.current = setTimeout(() => {
      console.log("Role check timeout triggered - forcing loading to false");
      setIsLoading(false);
      roleCheckInProgressRef.current = false;
      
      // Set client to true as fallback to prevent access issues
      if (userId) {
        setIsClient(true);
      }
      
      // Show a toast when we hit the timeout
      toast({
        title: "Slow response",
        description: "Role check is taking longer than expected. Try refreshing.",
        variant: "destructive"
      });
    }, 5000); // 5 second timeout
    
    try {
      // Check if this is the admin email (direct check) - a simplified approach
      const adminEmail = "alan@insight-ai-systems.com"; // Hard-coded admin email for direct check
      
      // Try to get the user's email from the user object in memory
      const userEmail = user?.email?.toLowerCase();
      
      console.log("Comparing emails for admin check:", { 
        userEmail, 
        adminEmail,
        isMatch: userEmail === adminEmail
      });
      
      // If this is the admin email, set admin role to true
      if (userEmail === adminEmail) {
        console.log("Admin email match found - granting admin role");
        setIsAdmin(true);
        setIsClient(true);
      } else {
        // For all other users, default to client role only 
        setIsAdmin(false);
        setIsClient(true);
      }
      
      // Record when we last checked roles
      setLastRoleCheck(Date.now());
      
      // Clear the timeout since we got the roles successfully
      if (roleCheckTimeoutRef.current) {
        clearTimeout(roleCheckTimeoutRef.current);
        roleCheckTimeoutRef.current = null;
      }
      
      setIsLoading(false);
      roleCheckInProgressRef.current = false;
      
      return { 
        isAdmin: userEmail === adminEmail, 
        isClient: true 
      };
    } catch (error) {
      console.error("Error checking roles:", error);
      setIsLoading(false);
      
      // Clear the timeout if there was an error
      if (roleCheckTimeoutRef.current) {
        clearTimeout(roleCheckTimeoutRef.current);
        roleCheckTimeoutRef.current = null;
      }
      
      // Default to client role for authenticated users even if checks fail
      if (userId) {
        setIsClient(true);
      }
      roleCheckInProgressRef.current = false;
      return { isAdmin: false, isClient: userId ? true : false };
    }
  }, [toast, isAdmin, isClient, user, setIsAdmin, setIsClient, setIsLoading, setLastRoleCheck]);

  return {
    checkRolesWithTimeout,
    roleCheckTimeoutRef
  };
};
