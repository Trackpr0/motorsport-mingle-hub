
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Calendar } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import EventHeader from "@/components/event/EventHeader";
import { Button } from "@/components/ui/button";

const EventDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const eventData = location.state?.eventData || {};
  
  const [eventName, setEventName] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedInventory, setSelectedInventory] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
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
    
    // Previous month days
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
    
    // Current month days
    for (let i = 1; i <= days; i++) {
      currentMonthDays.push({
        day: i,
        month,
        year,
        current: true
      });
    }
    
    // Next month days
    const totalCalendarDays = 42; // 6 rows * 7 days
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
  
  const handleCreateEvent = async () => {
    if (!eventName.trim()) {
      toast.error("Please enter an event name");
      return;
    }
    
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }
    
    if (!selectedInventory) {
      toast.error("Please select an inventory item");
      return;
    }
    
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to create an event");
        return;
      }
      
      // Combine data from both steps
      const completeEventData = {
        ...eventData,
        event_name: eventName,
        event_date: selectedDate.toISOString(),
        inventory_item: selectedInventory,
        user_id: session.user.id,
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
          <h2 className="text-blue-600 font-medium mb-2">Trackday Event Image</h2>
          <div className="flex items-center justify-center bg-blue-100 rounded-lg h-32 text-center">
            <div className="text-center">
              <div className="bg-blue-200 rounded-lg p-4 inline-block">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <p className="mt-2 text-gray-500">Add Image</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-blue-600 font-medium mb-4">Select Day 1</h2>
          
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={handlePrevMonth} 
              className="text-blue-600"
            >
              &lt;
            </button>
            <h3 className="text-blue-600 font-medium">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
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
          <h2 className="text-blue-600 font-medium mb-2">Trackday Event Name</h2>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Enter Name"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-blue-600 font-medium mb-2">Select Inventory Item</h2>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Title Name</span>
            <span className="text-gray-400">▼</span>
          </div>
        </div>
        
        <Button 
          className="w-full bg-blue-600 text-white hover:bg-blue-700"
          onClick={handleCreateEvent}
          disabled={loading}
        >
          Create Event
        </Button>
      </div>
    </div>
  );
};

export default EventDetails;
