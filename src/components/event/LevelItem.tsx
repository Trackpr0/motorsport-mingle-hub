
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface LevelItemProps {
  levelId: number;
  levelName: string;
  isSelected: boolean;
  priceValue: string;
  quantity: number;
  onLevelToggle: (levelId: number) => void;
  onPriceChange: (levelId: number, price: string) => void;
  onQuantityChange: (levelId: number, change: number) => void;
}

const LevelItem = ({
  levelId,
  levelName,
  isSelected,
  priceValue,
  quantity,
  onLevelToggle,
  onPriceChange,
  onQuantityChange
}: LevelItemProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`level-${levelId}`}
          checked={isSelected}
          onChange={() => onLevelToggle(levelId)}
          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor={`level-${levelId}`} className="ml-2 text-black">
          {levelName}
        </label>
      </div>
      
      {isSelected && (
        <div className="pl-7 space-y-4">
          <div>
            <label className="block text-gray-600 text-sm mb-1">
              Price per ticket (in $)
            </label>
            <Input 
              type="text"
              placeholder="0.00"
              value={priceValue}
              onChange={(e) => onPriceChange(levelId, e.target.value)}
              className="bg-white border-gray-300"
            />
          </div>
          
          <div>
            <label className="block text-gray-600 text-sm mb-1">
              # of Tickets for Purchase
            </label>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-8 w-8"
                onClick={() => onQuantityChange(levelId, -1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <span className="text-center w-8">
                {quantity}
              </span>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-8 w-8"
                onClick={() => onQuantityChange(levelId, 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LevelItem;
