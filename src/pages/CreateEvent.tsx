
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
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
  const [selectedLevels, setSelectedLevels] = useState<number[]>([]);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  
  const handleLevelToggle = (levelId: number) => {
    setSelectedLevels(prev => {
      if (prev.includes(levelId)) {
        return prev.filter(id => id !== levelId);
      } else {
        return [...prev, levelId];
      }
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
    
    // Here we would typically save the event data
    toast.success("Event created successfully!");
    navigate("/profile");
  };
  
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE] flex flex-col">
      <div className="bg-white p-4 flex items-center">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleGoBack}
          className="mr-2"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold flex-1 text-center pr-8">Add Item</h1>
      </div>
      
      <div className="flex-1 p-4 space-y-4">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <label className="block text-blue-600 font-medium mb-2">Title Name</label>
          <Input 
            placeholder="Enter Here" 
            value={title}
            onChange={handleTitleChange}
            className="w-full bg-white text-black border-gray-300"
          />
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <label className="block text-blue-600 font-medium mb-2">Select # of Levels</label>
          
          <div className="space-y-2">
            {levels.map((level) => (
              <div key={level.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`level-${level.id}`}
                  checked={selectedLevels.includes(level.id)}
                  onChange={() => handleLevelToggle(level.id)}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={`level-${level.id}`} className="ml-2">
                  {level.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full bg-white border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          Save & Add New Inventory Item
        </Button>
        
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={handleSaveAndConfirm}
        >
          Save & Confirm
        </Button>
      </div>
    </div>
  );
};

export default CreateEvent;
