
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
      
      // Update post data structure to match the actual database schema
      const completeEventData = {
        caption: eventName,
        has_event: true,
        type: eventData.type || 'event',
        location: eventLocation || null,
        user_id: session.user.id,
        image_url: imageUrl || 'https://placehold.co/600x400?text=No+Image',
        // Include any other fields from eventData
        ...eventData
      };
      
      const { data, error } = await supabase
        .from('posts')
        .insert(completeEventData)
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success("Event created successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
    } finally {
      setLoading(false);
    }
  };
  
  return {
    loading,
    handleCreateEvent
  };
};
