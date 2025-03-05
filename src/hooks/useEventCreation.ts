
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface LevelData {
  price: string;
  quantity: number;
}

export const useEventCreation = () => {
  const [title, setTitle] = useState("");
  const [membersOnly, setMembersOnly] = useState(false);
  const [selectedLevels, setSelectedLevels] = useState<number[]>([]);
  const [levelData, setLevelData] = useState<Record<number, LevelData>>({});
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

  return {
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
    setLoading,
    handleLevelToggle,
    handlePriceChange,
    handleQuantityChange
  };
};
