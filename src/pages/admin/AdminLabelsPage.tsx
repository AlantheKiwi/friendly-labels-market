
import React, { useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import LabelManagementHeader from "@/components/admin/labels/LabelManagementHeader";
import LabelTable from "@/components/admin/labels/LabelTable";
import { useLabelManagement } from "@/hooks/labels/useLabelManagement";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth/AuthContext";

const AdminLabelsPage = () => {
  const { labels, searchQuery, setSearchQuery, fetchLabels, deleteLabel } = useLabelManagement();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      return;
    }
    fetchLabels();
  }, [isAdmin, navigate, searchQuery]);

  const handleAddLabel = () => {
    // This will be implemented in the next step
    console.log("Add label clicked");
  };

  const handleEditLabel = (label: any) => {
    // This will be implemented in the next step
    console.log("Edit label:", label);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />
      <main className="flex-grow bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Label Management</h1>
          
          <div className="space-y-6">
            <LabelManagementHeader
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onAddLabel={handleAddLabel}
            />
            
            <LabelTable
              labels={labels}
              onEdit={handleEditLabel}
              onDelete={deleteLabel}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLabelsPage;
