
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface EventHeaderProps {
  onGoBack: () => void;
}

const EventHeader = ({ onGoBack }: EventHeaderProps) => {
  return (
    <div className="bg-white p-4 flex items-center">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onGoBack}
        className="mr-auto"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <h1 className="text-xl font-bold mr-auto">Inventory Creation</h1>
    </div>
  );
};

export default EventHeader;
