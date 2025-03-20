
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Table as TableIcon, Grid } from "lucide-react";

interface ClientSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  viewMode: "grid" | "table";
  onViewModeChange: (mode: "grid" | "table") => void;
}

const ClientSearchBar: React.FC<ClientSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="bg-white p-4 rounded-md shadow-sm mb-6">
      <div className="flex gap-4 items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search clients..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-md">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("table")}
          >
            <TableIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientSearchBar;
