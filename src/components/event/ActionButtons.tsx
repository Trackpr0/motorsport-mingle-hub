
import React from "react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onAddInventory: () => void;
  onSaveAndContinue: () => void;
}

const ActionButtons = ({ onAddInventory, onSaveAndContinue }: ActionButtonsProps) => {
  return (
    <>
      <Button 
        variant="outline" 
        className="w-full bg-white border-blue-600 text-blue-600 hover:bg-blue-50"
        onClick={onAddInventory}
      >
        Add Inventory
      </Button>

      <Button 
        className="w-full bg-blue-600 text-white hover:bg-blue-700"
        onClick={onSaveAndContinue}
      >
        Save & Continue
      </Button>
    </>
  );
};

export default ActionButtons;
