
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface OrderSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const OrderSearch: React.FC<OrderSearchProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <Input
        placeholder="Search orders..."
        className="pl-10"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default OrderSearch;
