
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import EventHeader from "@/components/event/EventHeader";
import { Button } from "@/components/ui/button";
import { EventImageUpload } from "@/components/event/EventImageUpload";
import Calendar from "@/components/event/Calendar";
import EventForm from "@/components/event/EventForm";
import { useEventImageUpload } from "@/hooks/useEventImageUpload";
import { useEventCreationSubmit } from "@/hooks/useEventCreationSubmit";

const EventDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const eventData = location.state?.eventData || {};
  
  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const { eventImage, handleFileChange } = useEventImageUpload();
  const { loading, handleCreateEvent } = useEventCreationSubmit();
  
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
  
  const handleSubmitEvent = () => {
    handleCreateEvent({
      eventName,
      startDate,
      endDate,
      isMultiDay,
      eventLocation,
      eventImage,
      eventData
    });
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
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-blue-600 font-medium">Select Day(s)</h2>
            <div className="flex items-center">
              <label className="text-sm mr-2">Multi-day event</label>
              <input 
                type="checkbox" 
                checked={isMultiDay}
                onChange={(e) => setIsMultiDay(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <Calendar 
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            startDate={startDate}
            endDate={endDate}
            isMultiDay={isMultiDay}
            onDateSelection={handleDateSelection}
          />
        </div>
        
        <EventForm 
          eventName={eventName}
          setEventName={setEventName}
          eventLocation={eventLocation}
          setEventLocation={setEventLocation}
          isMultiDay={isMultiDay}
          setIsMultiDay={setIsMultiDay}
        />
        
        <Button 
          className="w-full bg-blue-600 text-white hover:bg-blue-700"
          onClick={handleSubmitEvent}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Event"}
        </Button>
      </div>
    </div>
  );
};

export default EventDetails;
