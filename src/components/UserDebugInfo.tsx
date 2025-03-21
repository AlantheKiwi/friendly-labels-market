
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const UserDebugInfo = () => {
  const { user, isClient, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading authentication status...</div>;
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle>Authentication Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {user ? (
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
            </>
          ) : (
            <p>Not logged in</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDebugInfo;
