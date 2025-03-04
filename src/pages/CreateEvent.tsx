
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import EventHeader from "@/components/event/EventHeader";
import TitleInput from "@/components/event/TitleInput";
import LevelSelector from "@/components/event/LevelSelector";
import ActionButtons from "@/components/event/ActionButtons";
import { Level } from "@/components/event/LevelSelector";

const levels: Level[] = [
  { id: 1, name: "Level 1" },
  { id: 2, name: "Level 2" },
  { id: 3, name: "Level 3" },
  { id: 4, name: "Level 4" },
];

const CreateEvent = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [membersOnly, setMembersOnly] = useState(false);
  const [selectedLevels, setSelectedLevels] = useState<number[]>([]);
  const [levelData, setLevelData] = useState<Record<number, { price: string; quantity: number }>>({});
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  
  const handleLevelToggle = (levelId: number) => {
    setSelectedLevels(prev => {
      if (prev.includes(levelId)) {
        return prev.filter(id => id !== levelId);
      } else {
        if (!levelData[levelId]) {
          setLevelData(prev => ({
            ...prev,
            [levelId]: { price: "", quantity: 1 }
          }));
        }
        return [...prev, levelId];
      }
    });
  };

  const handlePriceChange = (levelId: number, price: string) => {
    setLevelData(prev => ({
      ...prev,
      [levelId]: { ...prev[levelId], price }
    }));
  };

  const handleQuantityChange = (levelId: number, change: number) => {
    setLevelData(prev => {
      const currentQuantity = prev[levelId]?.quantity || 1;
      const newQuantity = Math.max(1, currentQuantity + change);
      return {
        ...prev,
        [levelId]: { ...prev[levelId], quantity: newQuantity }
      };
    });
  };
  
  const validateForm = () => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return false;
    }
    
    if (selectedLevels.length === 0) {
      toast.error("Please select at least one level");
      return false;
    }

    const missingPrices = selectedLevels.some(levelId => 
      !levelData[levelId]?.price || levelData[levelId]?.price.trim() === ""
    );
    
    if (missingPrices) {
      toast.error("Please enter prices for all selected levels");
      return false;
    }
    
    return true;
  };
  
  const handleSaveAndContinue = () => {
    if (validateForm()) {
      toast.success("Inventory item created successfully!");
      navigate("/profile");
    }
  };
  
  const handleGoBack = () => {
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE] flex flex-col">
      <EventHeader onGoBack={handleGoBack} />
      
      <div className="flex-1 p-4 space-y-4">
        <TitleInput 
          title={title}
          membersOnly={membersOnly}
          onTitleChange={handleTitleChange}
          onMembersOnlyChange={setMembersOnly}
        />
        
        <LevelSelector 
          levels={levels}
          selectedLevels={selectedLevels}
          levelData={levelData}
          onLevelToggle={handleLevelToggle}
          onPriceChange={handlePriceChange}
          onQuantityChange={handleQuantityChange}
        />
        
        <ActionButtons 
          onAddInventory={handleSaveAndContinue}
          onSaveAndContinue={handleSaveAndContinue}
        />
      </div>
    </div>
  );
};

export default CreateEvent;
