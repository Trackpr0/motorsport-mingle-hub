
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
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers, comma, and dot in the price field
    const value = e.target.value;
    if (value === '' || /^[0-9.,]+$/.test(value)) {
      onPriceChange(levelId, value);
    }
  };

  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numeric values
    if (value === '' || /^[0-9]+$/.test(value)) {
      const numValue = value === '' ? 1 : parseInt(value, 10);
      // Calculate the change relative to the current quantity
      const change = numValue - quantity;
      onQuantityChange(levelId, change);
    }
  };

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
              onChange={handlePriceChange}
              className="bg-white border-gray-300 text-black"
            />
          </div>
          
          <div>
            <label className="block text-gray-600 text-sm mb-1">
              # of Tickets for Purchase
            </label>
            <div className="flex items-center space-x-3">
              <Button 
                size="icon" 
                className="rounded-full h-8 w-8 bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => onQuantityChange(levelId, -1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <Input
                type="text"
                value={quantity}
                onChange={handleQuantityInputChange}
                className="text-center w-16 h-8 p-1 text-black font-medium bg-white border-gray-300"
              />
              
              <Button 
                size="icon" 
                className="rounded-full h-8 w-8 bg-blue-600 text-white hover:bg-blue-700"
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
