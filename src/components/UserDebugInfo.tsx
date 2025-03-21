
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

const UserDebugInfo = () => {
  const { user, isClient, isAdmin, isLoading, session } = useAuth();

  // Add debug button to force role check
  const handleDebugRoleCheck = async () => {
    try {
      // Force a roles check by reloading the page
      window.location.reload();
    } catch (error) {
      console.error("Debug error:", error);
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
              <Button 
                size="sm" 
                variant="outline" 
                className="mt-2" 
                onClick={handleDebugRoleCheck}
              >
                Refresh Authentication
              </Button>
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
              <Button 
                size="sm" 
                variant="outline" 
                className="mt-2" 
                onClick={handleDebugRoleCheck}
              >
                Refresh Authentication
              </Button>
            </>
          ) : (
            <>
              <p>Not logged in</p>
              <div className="text-xs text-gray-400 mt-2">
                <p>Debug info:</p>
                <p>Session exists: No</p>
                <p>Auth state initialized: Yes</p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDebugInfo;
