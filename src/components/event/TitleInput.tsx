
import React from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface TitleInputProps {
  title: string;
  membersOnly: boolean;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMembersOnlyChange: (checked: boolean) => void;
}

const TitleInput = ({ 
  title, 
  membersOnly, 
  onTitleChange, 
  onMembersOnlyChange 
}: TitleInputProps) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center">
        <label className="block text-blue-600 font-medium">Title Name</label>
        <div className="flex items-center space-x-2">
          <span className={membersOnly ? "text-black" : "text-gray-500"}>Members Only</span>
          <Switch 
            checked={membersOnly} 
            onCheckedChange={onMembersOnlyChange} 
          />
        </div>
      </div>
      <Input 
        placeholder="Enter Here" 
        value={title}
        onChange={onTitleChange}
        className="w-full bg-white text-black border-gray-300 mt-2"
      />
    </div>
  );
};

export default TitleInput;
