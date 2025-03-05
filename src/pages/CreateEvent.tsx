
import React from "react";
import { useNavigate } from "react-router-dom";
import EventHeader from "@/components/event/EventHeader";
import TitleInput from "@/components/event/TitleInput";
import LevelSelector from "@/components/event/LevelSelector";
import ActionButtons from "@/components/event/ActionButtons";
import MembershipSelector from "@/components/event/MembershipSelector";
import { useEventCreation } from "@/hooks/useEventCreation";
import { validateEventForm } from "@/utils/eventValidation";

const levels = [
  { id: 1, name: "Level 1" },
  { id: 2, name: "Level 2" },
  { id: 3, name: "Level 3" },
  { id: 4, name: "Level 4" },
];

const CreateEvent = () => {
  const navigate = useNavigate();
  const {
    title,
    setTitle,
    membersOnly,
    setMembersOnly,
    selectedLevels,
    levelData,
    memberships,
    selectedMembership,
    setSelectedMembership,
    loading,
    handleLevelToggle,
    handlePriceChange,
    handleQuantityChange
  } = useEventCreation();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSaveAndContinue = () => {
    if (!validateEventForm({
      title,
      selectedLevels,
      levelData,
      membersOnly,
      selectedMembership
    })) return;

    const eventData = {
      caption: title,
      membership_id: membersOnly ? selectedMembership : null,
      levels: selectedLevels.map(levelId => ({
        level_id: levelId,
        price: levelData[levelId].price,
        quantity: levelData[levelId].quantity
      }))
    };
    
    navigate("/event-details", { state: { eventData } });
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
        
        <MembershipSelector
          membersOnly={membersOnly}
          selectedMembership={selectedMembership}
          memberships={memberships}
          onMembershipChange={setSelectedMembership}
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
          onSaveAndContinue={handleSaveAndContinue}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default CreateEvent;
