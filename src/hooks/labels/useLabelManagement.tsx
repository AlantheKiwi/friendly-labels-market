
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Label {
  id: string;
  name: string;
  sku: string | null;
  base_price: number;
  material: string;
  finish: string;
  stock_quantity: number;
  active: boolean;
}

export const useLabelManagement = () => {
  const [labels, setLabels] = useState<Label[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const fetchLabels = async () => {
    const { data, error } = await supabase
      .from('labels')
      .select('*')
      .ilike('name', `%${searchQuery}%`);

    if (error) {
      toast({
        title: "Error fetching labels",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setLabels(data);
  };

  const deleteLabel = async (label: Label) => {
    const { error } = await supabase
      .from('labels')
      .delete()
      .eq('id', label.id);

    if (error) {
      toast({
        title: "Error deleting label",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Label deleted",
      description: `${label.name} has been deleted successfully.`,
    });

    await fetchLabels();
  };

  return {
    labels,
    searchQuery,
    setSearchQuery,
    fetchLabels,
    deleteLabel,
  };
};
