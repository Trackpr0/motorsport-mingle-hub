
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Minus, Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const levels = [
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
        // Initialize price and inventory when a level is selected
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
      const newQuantity = Math.max(1, currentQuantity + change); // Ensure quantity is at least 1
      return {
        ...prev,
        [levelId]: { ...prev[levelId], quantity: newQuantity }
      };
    });
  };
  
  const handleSaveAndConfirm = () => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    
    if (selectedLevels.length === 0) {
      toast.error("Please select at least one level");
      return;
    }

    // Validate that all selected levels have prices
    const missingPrices = selectedLevels.some(levelId => 
      !levelData[levelId]?.price || levelData[levelId]?.price.trim() === ""
    );
    
    if (missingPrices) {
      toast.error("Please enter prices for all selected levels");
      return;
    }
    
    // Here we would typically save the event data including prices and quantities
    toast.success("Inventory item created successfully!");
    navigate("/profile");
  };
  
  const handleGoBack = () => {
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE] flex flex-col">
      <div className="bg-white p-4 flex items-center">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleGoBack}
          className="mr-auto"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold mr-auto">Inventory Creation</h1>
      </div>
      
      <div className="flex-1 p-4 space-y-4">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center">
            <label className="block text-blue-600 font-medium">Title Name</label>
            <div className="flex items-center space-x-2">
              <span className={membersOnly ? "text-black" : "text-gray-500"}>Members Only</span>
              <Switch 
                checked={membersOnly} 
                onCheckedChange={setMembersOnly} 
                className={membersOnly ? "bg-blue-600" : "bg-gray-300"}
              />
            </div>
          </div>
          <Input 
            placeholder="Enter Here" 
            value={title}
            onChange={handleTitleChange}
            className="w-full bg-white text-black border-gray-300 mt-2"
          />
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <label className="block text-blue-600 font-medium mb-4">Select # of Levels</label>
          
          <div className="space-y-6">
            {levels.map((level) => (
              <div key={level.id} className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`level-${level.id}`}
                    checked={selectedLevels.includes(level.id)}
                    onChange={() => handleLevelToggle(level.id)}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={`level-${level.id}`} className="ml-2 text-black">
                    {level.name}
                  </label>
                </div>
                
                {selectedLevels.includes(level.id) && (
                  <div className="pl-7 space-y-4">
                    <div>
                      <label className="block text-gray-600 text-sm mb-1">
                        Price per ticket (in $)
                      </label>
                      <Input 
                        type="text"
                        placeholder="0.00"
                        value={levelData[level.id]?.price || ""}
                        onChange={(e) => handlePriceChange(level.id, e.target.value)}
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
                          onClick={() => handleQuantityChange(level.id, -1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        
                        <span className="text-center w-8">
                          {levelData[level.id]?.quantity || 1}
                        </span>
                        
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="rounded-full h-8 w-8"
                          onClick={() => handleQuantityChange(level.id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedLevels.includes(level.id) && level.id !== levels[levels.length - 1].id && (
                  <div className="border-b border-gray-200 my-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full bg-white border-blue-600 text-blue-600 hover:bg-blue-50"
          onClick={handleSaveAndConfirm}
        >
          Add Inventory
        </Button>

        <Button 
          className="w-full bg-blue-600 text-white hover:bg-blue-700"
          onClick={handleSaveAndConfirm}
        >
          Save & Continue
        </Button>
      </div>
    </div>
  );
};

export default CreateEvent;
