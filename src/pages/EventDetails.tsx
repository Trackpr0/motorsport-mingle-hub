import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Calendar, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import EventHeader from "@/components/event/EventHeader";
import { Button } from "@/components/ui/button";
import LocationInput from "@/components/LocationInput";
import { EventImageUpload } from "@/components/event/EventImageUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EventDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const eventData = location.state?.eventData || {};
  
  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [eventImage, setEventImage] = useState<string | null>(null);
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
  
  const daysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const days = daysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();
    
    const prevMonthDays = [];
    const currentMonthDays = [];
    const nextMonthDays = [];
    
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const prevMonthTotalDays = daysInMonth(prevMonthYear, prevMonth);
    
    for (let i = firstDay - 1; i >= 0; i--) {
      prevMonthDays.push({
        day: prevMonthTotalDays - i,
        month: prevMonth,
        year: prevMonthYear,
        current: false
      });
    }
    
    for (let i = 1; i <= days; i++) {
      currentMonthDays.push({
        day: i,
        month,
        year,
        current: true
      });
    }
    
    const totalCalendarDays = 42;
    const remainingDays = totalCalendarDays - (prevMonthDays.length + currentMonthDays.length);
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextMonthYear = month === 11 ? year + 1 : year;
    
    for (let i = 1; i <= remainingDays; i++) {
      nextMonthDays.push({
        day: i,
        month: nextMonth,
        year: nextMonthYear,
        current: false
      });
    }
    
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };
  
  const handleGoBack = () => {
    navigate("/create-event", { state: { eventData } });
  };
  
  const handleDateSelection = (day: any) => {
    if (day.current) {
      setSelectedDate(new Date(day.year, day.month, day.day));
    }
  };
  
  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() - 1);
      return newMonth;
    });
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + 1);
      return newMonth;
    });
  };
  
  const handleMonthChange = (value: string) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(parseInt(value));
      return newMonth;
    });
  };
  
  const handleYearChange = (value: string) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setFullYear(parseInt(value));
      return newMonth;
    });
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
    if (!eventName.trim()) {
      toast.error("Please enter an event name");
      return;
    }
    
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }
    
    if (!eventLocation) {
      toast.error("Please enter an event location");
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
        event_date: selectedDate.toISOString(),
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
  
  const isDateSelected = (day: any) => {
    if (!selectedDate || !day.current) return false;
    return (
      selectedDate.getDate() === day.day &&
      selectedDate.getMonth() === day.month &&
      selectedDate.getFullYear() === day.year
    );
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
          <h2 className="text-blue-600 font-medium mb-4">Select Day(s)</h2>
          
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={handlePrevMonth} 
              className="text-blue-600"
            >
              &lt;
            </button>
            
            <div className="flex items-center justify-center gap-2">
              <Select
                value={currentMonth.getMonth().toString()}
                onValueChange={handleMonthChange}
              >
                <SelectTrigger className="h-auto py-0 px-1 border-0 bg-transparent focus:ring-0 focus:ring-offset-0 shadow-none font-medium text-blue-600 [&>svg]:hidden">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {monthNames.map((month, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={currentMonth.getFullYear().toString()}
                onValueChange={handleYearChange}
              >
                <SelectTrigger className="h-auto py-0 px-1 border-0 bg-transparent focus:ring-0 focus:ring-offset-0 shadow-none font-medium text-blue-600 [&>svg]:hidden">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <button 
              onClick={handleNextMonth}
              className="text-blue-600"
            >
              &gt;
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-2 text-center">
            <div className="text-blue-600 font-medium">M</div>
            <div className="text-blue-600 font-medium">T</div>
            <div className="text-blue-600 font-medium">W</div>
            <div className="text-blue-600 font-medium">T</div>
            <div className="text-blue-600 font-medium">F</div>
            <div className="text-blue-600 font-medium">S</div>
            <div className="text-blue-600 font-medium">S</div>
            
            {getCalendarDays().map((day, index) => (
              <div 
                key={index}
                onClick={() => handleDateSelection(day)}
                className={`p-2 cursor-pointer ${
                  day.current ? "text-black" : "text-gray-400"
                } ${
                  isDateSelected(day) ? "bg-blue-600 text-white rounded-full" : ""
                }`}
              >
                {day.day}
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-blue-600 font-medium mb-2">Event Name</h2>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Enter Name"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-blue-600 font-medium mb-2">Event Location</h2>
          <LocationInput
            value={eventLocation}
            onChange={setEventLocation}
            placeholder="Enter track location..."
            mapboxToken="pk.eyJ1IjoidHJhY2todWJsbGMiLCJhIjoiY203dHozcWd4MGN0ejJqcHFwNDBzd3l5OCJ9.QFkcZKkOyJzECS5PwYzT7Q"
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
