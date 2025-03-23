
import React from "react";

interface AdminCredentialHintsProps {
  adminEmail: string;
  defaultPassword: string;
}

const AdminCredentialHints: React.FC<AdminCredentialHintsProps> = ({ 
  adminEmail, 
  defaultPassword 
}) => {
  return (
    <div>
      <p className="text-xs text-amber-600 mt-2">
        Default admin email: {adminEmail}
      </p>
      <p className="text-xs text-amber-600">
        Default admin password: {defaultPassword}
      </p>
      <p className="text-xs text-gray-500">
        If you're having trouble logging in, try these default credentials.
      </p>
    </div>
  );
};

export default AdminCredentialHints;
