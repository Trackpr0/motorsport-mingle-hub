
import { toast } from "sonner";
import { LevelData } from "@/hooks/useEventCreation";

interface ValidationParams {
  title: string;
  selectedLevels: number[];
  levelData: Record<number, LevelData>;
  membersOnly: boolean;
  selectedMembership: string | null;
}

export const validateEventForm = ({
  title,
  selectedLevels,
  levelData,
  membersOnly,
  selectedMembership
}: ValidationParams): boolean => {
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
  
  if (membersOnly && !selectedMembership) {
    toast.error("Please select a membership for members-only event");
    return false;
  }
  
  return true;
};
