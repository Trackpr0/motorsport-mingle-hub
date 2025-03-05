
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { validateEventDetailsForm } from "@/utils/eventValidation";

interface EventDetailsData {
  eventName: string;
  startDate: Date | null;
  endDate: Date | null;
  isMultiDay: boolean;
  eventLocation: string;
  eventImage: string | null;
  eventData: any;
}

export const useEventCreationSubmit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const handleCreateEvent = async ({
    eventName,
    startDate,
    endDate,
    isMultiDay,
    eventLocation,
    eventImage,
    eventData
  }: EventDetailsData) => {
    if (!validateEventDetailsForm({
      selectedDate: startDate,
      eventLocation
    })) return;
    
    if (isMultiDay && !endDate) {
      toast.error("Please select both start and end dates for multi-day events");
      return;
    }
    
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to create an event");
        return;
      }
      
      let imageUrl = null;
      
      if (eventImage) {
        const base64Data = eventImage.split(',')[1];
        const filename = `event_${Date.now()}.jpg`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('event_images')
          .upload(filename, base64Data, {
            contentType: 'image/jpeg',
            upsert: false
          });
          
        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          toast.warning("Failed to upload image, but continuing with event creation");
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('event_images')
            .getPublicUrl(filename);
            
          imageUrl = publicUrl;
        }
      }
      
      // Save levels data for later use but remove from the main event data
      const { levels, ...cleanEventData } = eventData;
      
      // Create event date from selected date
      const eventDate = startDate ? startDate.toISOString() : null;
      const eventEndDate = endDate ? endDate.toISOString() : null;
      
      // Update post data structure to match the actual database schema
      const completeEventData = {
        caption: eventName,
        has_event: true,
        type: cleanEventData.type || 'event',
        location: eventLocation || null,
        user_id: session.user.id,
        image_url: imageUrl || 'https://placehold.co/600x400?text=No+Image',
        event_date: eventDate,
        event_end_date: eventEndDate,
        ...cleanEventData
      };
      
      const { data, error } = await supabase
        .from('posts')
        .insert(completeEventData)
        .select()
        .single();
        
      if (error) throw error;
      
      // Insert levels data into the event_levels table
      if (levels && levels.length > 0 && data) {
        const levelsToInsert = levels.map(level => ({
          post_id: data.id,
          level_id: level.level_id,
          price: level.price,
          quantity: level.quantity
        }));
        
        const { error: levelsError } = await supabase
          .from('event_levels')
          .insert(levelsToInsert);
          
        if (levelsError) {
          console.error("Error saving event levels:", levelsError);
          toast.warning("Event created but there was an issue saving level information");
        }
      }
      
      toast.success("Event created successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error(`Failed to create event: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };
  
  return {
    loading,
    handleCreateEvent
  };
};
