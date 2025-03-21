
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

const UserDebugInfo = () => {
  const { user, isClient, isAdmin, isLoading, session } = useAuth();
  const { toast } = useToast();

  // Add debug button to force role check
  const handleDebugRoleCheck = async () => {
    try {
      console.log("Manually refreshing authentication state...");
      toast({
        title: "Refreshing authentication",
        description: "Reloading the page to refresh authentication state...",
      });
      
      // Force a hard reload to clear any cached state
      window.location.reload();
    } catch (error) {
      console.error("Debug error:", error);
      toast({
        title: "Error",
        description: "Failed to refresh authentication state",
        variant: "destructive"
      });
    }
  };

  // Add debug button to force sign out
  const handleForceSignOut = async () => {
    try {
      console.log("Force clearing all auth data...");
      toast({
        title: "Force Sign Out",
        description: "Clearing all authentication data and reloading...",
      });
      
      // Clear any supabase auth related items in localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('supabase.auth.')) {
          localStorage.removeItem(key);
          console.log(`Cleared localStorage item: ${key}`);
        }
      });
      
      // Redirect to home page and force reload
      window.location.href = "/";
    } catch (error) {
      console.error("Force sign out error:", error);
      toast({
        title: "Error",
        description: "Failed to force sign out",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Authentication Status</span>
          {isLoading && <span className="text-xs text-amber-500 animate-pulse">Loading...</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {isLoading ? (
            <div className="space-y-2">
              <p>Loading authentication status...</p>
              <p className="text-sm text-gray-500">Auth state is still initializing. This may take a moment.</p>
              <div className="text-xs text-gray-400 mt-2 space-y-1">
                <p>Debug info:</p>
                <p>Session exists: {session ? 'Yes' : 'No'}</p>
                <p>User exists: {user ? 'Yes' : 'No'}</p>
                {user && <p>User ID: {user.id}</p>}
              </div>
              <div className="flex gap-2 mt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-2 flex-1" 
                  onClick={handleDebugRoleCheck}
                >
                  Force Refresh Authentication
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  className="mt-2 flex-1" 
                  onClick={handleForceSignOut}
                >
                  Force Sign Out
                </Button>
              </div>
            </div>
          ) : user ? (
            <>
              <p><span className="font-medium">Logged in as:</span> {user.email}</p>
              <p><span className="font-medium">User ID:</span> {user.id}</p>
              <p><span className="font-medium">Roles:</span> 
                {isClient && <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Client</span>}
                {isAdmin && <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Admin</span>}
                {!isClient && !isAdmin && <span className="ml-2 text-gray-500">No roles assigned</span>}
              </p>
              <p><span className="font-medium">Portal Access:</span>
                {isClient ? 
                  <span className="ml-2 text-green-600">Can access client portal</span> : 
                  <span className="ml-2 text-red-600">No client portal access</span>
                }
              </p>
              <div className="text-xs text-gray-400 mt-2 space-y-1">
                <p>Debug info:</p>
                <p>Session exists: Yes</p>
                <p>Auth state initialized: Yes</p>
              </div>
              <div className="flex gap-2 mt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-2 flex-1" 
                  onClick={handleDebugRoleCheck}
                >
                  Refresh Authentication
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  className="mt-2 flex-1" 
                  onClick={handleForceSignOut}
                >
                  Force Sign Out
                </Button>
              </div>
            </>
          ) : (
            <>
              <p>Not logged in</p>
              <div className="text-xs text-gray-400 mt-2">
                <p>Debug info:</p>
                <p>Session exists: No</p>
                <p>Auth state initialized: Yes</p>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="mt-2 w-full" 
                onClick={handleDebugRoleCheck}
              >
                Refresh Authentication
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDebugInfo;
