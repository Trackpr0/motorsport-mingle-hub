
import React from "react";
import LevelItem from "./LevelItem";

export interface Level {
  id: number;
  name: string;
}

interface LevelSelectorProps {
  levels: Level[];
  selectedLevels: number[];
  levelData: Record<number, { price: string; quantity: number }>;
  onLevelToggle: (levelId: number) => void;
  onPriceChange: (levelId: number, price: string) => void;
  onQuantityChange: (levelId: number, change: number) => void;
}

const LevelSelector = ({
  levels,
  selectedLevels,
  levelData,
  onLevelToggle,
  onPriceChange,
  onQuantityChange
}: LevelSelectorProps) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <label className="block text-blue-600 font-medium mb-4">Select # of Levels</label>
      
      <div className="space-y-6">
        {levels.map((level, index) => (
          <React.Fragment key={level.id}>
            <LevelItem
              levelId={level.id}
              levelName={level.name}
              isSelected={selectedLevels.includes(level.id)}
              priceValue={levelData[level.id]?.price || ""}
              quantity={levelData[level.id]?.quantity || 1}
              onLevelToggle={onLevelToggle}
              onPriceChange={onPriceChange}
              onQuantityChange={onQuantityChange}
            />
            
            {selectedLevels.includes(level.id) && index !== levels.length - 1 && (
              <div className="border-b border-gray-200 my-4"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default LevelSelector;
