
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ActionButtonsProps {
  onAddInventory: () => void;
  onSaveAndContinue: () => void;
  loading?: boolean;
}

const ActionButtons = ({ onAddInventory, onSaveAndContinue, loading = false }: ActionButtonsProps) => {
  return (
    <>
      <Button 
        variant="outline" 
        className="w-full bg-white border-blue-600 text-blue-600 hover:bg-blue-50"
        onClick={onAddInventory}
        disabled={loading}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        Add Inventory
      </Button>

      <Button 
        className="w-full bg-blue-600 text-white hover:bg-blue-700"
        onClick={onSaveAndContinue}
        disabled={loading}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        Save & Continue
      </Button>
    </>
  );
};

export default ActionButtons;
