
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
          toast.error("Failed to upload image");
          setLoading(false);
          return;
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from('event_images')
          .getPublicUrl(filename);
          
        imageUrl = publicUrl;
      }
      
      const completeEventData = {
        ...eventData,
        event_name: eventName,
        event_date: startDate?.toISOString(),
        event_end_date: endDate ? endDate.toISOString() : null,
        is_multi_day: isMultiDay && endDate !== null,
        location: eventLocation,
        user_id: session.user.id,
        image_url: imageUrl
      };
      
      const { data, error } = await supabase
        .from('posts')
        .upsert(completeEventData)
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
