
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ActionButtonsProps {
  onSaveAndContinue: () => void;
  loading?: boolean;
  disabled?: boolean;
  text?: string;
}

const ActionButtons = ({ 
  onSaveAndContinue, 
  loading = false,
  disabled = false,
  text = "Continue"
}: ActionButtonsProps) => {
  return (
    <Button 
      className="w-full bg-blue-600 text-white hover:bg-blue-700"
      onClick={onSaveAndContinue}
      disabled={loading || disabled}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
      {text}
    </Button>
  );
};

export default ActionButtons;
