
import React from "react";
import LocationInput from "@/components/LocationInput";

interface EventFormProps {
  eventLocation: string;
  setEventLocation: (value: string) => void;
  isMultiDay: boolean;
  setIsMultiDay: (value: boolean) => void;
}

const EventForm: React.FC<EventFormProps> = ({
  eventLocation,
  setEventLocation,
  isMultiDay,
  setIsMultiDay
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-blue-600 font-medium mb-2">Event Location</h2>
      <LocationInput
        value={eventLocation}
        onChange={setEventLocation}
        placeholder="Enter track location..."
        mapboxToken="pk.eyJ1IjoidHJhY2todWJsbGMiLCJhIjoiY203dHozcWd4MGN0ejJqcHFwNDBzd3l5OCJ9.QFkcZKkOyJzECS5PwYzT7Q"
      />
    </div>
  );
};

export default EventForm;
