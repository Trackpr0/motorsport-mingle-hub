import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
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
  const [memberships, setMemberships] = useState<{id: string, name: string}[]>([]);
  const [selectedMembership, setSelectedMembership] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        
        const { data, error } = await supabase
          .from('memberships')
          .select('id, name')
          .eq('business_id', session.user.id);
          
        if (error) throw error;
        if (data) setMemberships(data);
      } catch (error) {
        console.error('Error fetching memberships:', error);
        toast.error('Failed to load memberships');
      }
    };
    
    fetchMemberships();
  }, []);
  
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
  
  const handleMembershipChange = (membershipId: string | null) => {
    setSelectedMembership(membershipId);
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
    
    if (membersOnly && !selectedMembership) {
      toast.error("Please select a membership for members-only event");
      return false;
    }
    
    return true;
  };
  
  const handleSaveAndContinue = async () => {
    if (!validateForm()) return;
    
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
        
        {membersOnly && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <label className="block text-blue-600 font-medium mb-2">Select Membership</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-black"
              value={selectedMembership || ''}
              onChange={(e) => handleMembershipChange(e.target.value || null)}
            >
              <option value="">Select a membership...</option>
              {memberships.map(membership => (
                <option key={membership.id} value={membership.id}>
                  {membership.name}
                </option>
              ))}
            </select>
            {memberships.length === 0 && (
              <p className="mt-2 text-sm text-gray-500">
                You need to create memberships first. Go to Profile &gt; Manage Memberships.
              </p>
            )}
          </div>
        )}
        
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
