
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import EventHeader from "@/components/event/EventHeader";
import { Button } from "@/components/ui/button";
import { EventImageUpload } from "@/components/event/EventImageUpload";
import Calendar from "@/components/event/Calendar";
import EventForm from "@/components/event/EventForm";
import { validateEventDetailsForm } from "@/utils/eventValidation";

const EventDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const eventData = location.state?.eventData || {};
  
  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [eventImage, setEventImage] = useState<string | null>(null);
  
  const handleGoBack = () => {
    navigate("/create-event", { state: { eventData } });
  };
  
  const handleDateSelection = (day: any) => {
    if (!day.current) return;
    
    const selectedDate = new Date(day.year, day.month, day.day);
    
    if (!isMultiDay) {
      // Single day selection
      setStartDate(selectedDate);
      setEndDate(null);
    } else {
      // Multi-day selection
      if (!startDate) {
        // First selection sets start date
        setStartDate(selectedDate);
      } else if (!endDate) {
        // Second selection sets end date
        if (selectedDate < startDate) {
          // If selected date is before start date, swap them
          setEndDate(startDate);
          setStartDate(selectedDate);
        } else {
          setEndDate(selectedDate);
        }
      } else {
        // Reset selection if both dates are already set
        setStartDate(selectedDate);
        setEndDate(null);
      }
    }
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const file = event.target.files[0];
    const fileReader = new FileReader();
    
    fileReader.onload = (e) => {
      if (e.target?.result) {
        setEventImage(e.target.result as string);
      }
    };
    
    fileReader.readAsDataURL(file);
  };
  
  const handleCreateEvent = async () => {
    if (!validateEventDetailsForm({
      eventName,
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

  return (
    <div className="min-h-screen bg-[#F8F9FE] flex flex-col">
      <EventHeader onGoBack={handleGoBack} />
      
      <div className="flex-1 p-4 space-y-4">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-blue-600 font-medium mb-2">Event Image</h2>
          <div className="flex items-center justify-center bg-blue-100 rounded-lg h-32 text-center overflow-hidden">
            <EventImageUpload 
              imageUrl={eventImage}
              onFileChange={handleFileChange}
            />
          </div>
        </div>
        
        <EventForm 
          eventName={eventName}
          setEventName={setEventName}
          eventLocation={eventLocation}
          setEventLocation={setEventLocation}
          isMultiDay={isMultiDay}
          setIsMultiDay={setIsMultiDay}
        />
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <Calendar 
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            startDate={startDate}
            endDate={endDate}
            isMultiDay={isMultiDay}
            onDateSelection={handleDateSelection}
          />
        </div>
        
        <Button 
          className="w-full bg-blue-600 text-white hover:bg-blue-700"
          onClick={handleCreateEvent}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Event"}
        </Button>
      </div>
    </div>
  );
};

export default EventDetails;
