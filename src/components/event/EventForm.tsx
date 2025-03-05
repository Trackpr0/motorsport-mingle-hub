
import React from "react";
import { Input } from "@/components/ui/input";
import LocationInput from "@/components/LocationInput";

interface EventFormProps {
  eventName: string;
  setEventName: (value: string) => void;
  eventLocation: string;
  setEventLocation: (value: string) => void;
  isMultiDay: boolean;
  setIsMultiDay: (value: boolean) => void;
}

const EventForm: React.FC<EventFormProps> = ({
  eventName,
  setEventName,
  eventLocation,
  setEventLocation,
  isMultiDay,
  setIsMultiDay
}) => {
  return (
    <>
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
        
        {/* Calendar will be inserted here in parent component */}
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
    </>
  );
};

export default EventForm;
