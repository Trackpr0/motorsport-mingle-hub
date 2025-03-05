
import React from "react";
import { Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface EventsGridProps {
  events: any[];
  loading: boolean;
}

const EventsGrid = ({ events, loading }: EventsGridProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-gray-500">Loading events...</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-500 font-medium">
        No events yet. Create your first event!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 p-2">
      {events.map((event) => {
        // Format date if available in event
        let eventDate = "Date not set";
        if (event.event_date) {
          try {
            eventDate = format(new Date(event.event_date), "MMM d, yyyy");
          } catch (error) {
            console.error("Error formatting date:", error);
          }
        }

        return (
          <div 
            key={event.id} 
            className="bg-white rounded-lg overflow-hidden shadow-sm"
            onClick={() => {
              toast.info("Event details view will be implemented soon");
            }}
          >
            <div className="relative">
              <img 
                src={event.image_url || "https://placehold.co/600x400?text=Event"} 
                alt={event.caption || "Event"} 
                className="w-full h-40 object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-3">
                <h3 className="text-white font-medium truncate">
                  {event.caption || "Untitled Event"}
                </h3>
              </div>
            </div>

            <div className="p-3">
              <div className="flex items-center text-gray-600 text-sm mb-1">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{eventDate}</span>
              </div>
              
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <Clock className="w-4 h-4 mr-1" />
                <span>Time not set</span>
              </div>
              
              {event.location && (
                <div className="text-sm text-gray-700">
                  📍 {event.location}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EventsGrid;
