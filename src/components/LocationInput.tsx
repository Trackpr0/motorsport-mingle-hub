
import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Input } from "@/components/ui/input";

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Temporary access token - in a production app, this should be stored in environment variables
// This is a placeholder token that should be replaced with your own
const MAPBOX_TOKEN = "pk.eyJ1IjoibG92YWJsZWRldiIsImEiOiJjbG9iZ2ZmdGswMWhtMmtwaDQzN2NlMXQ3In0.WdOqUosdZJERZBpJn12DAQ";

const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChange,
  placeholder = "Enter city, state, or location..."
}) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  mapboxgl.accessToken = MAPBOX_TOKEN;

  useEffect(() => {
    // Close suggestions when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const searchLocation = async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
      )}.json?access_token=${MAPBOX_TOKEN}&types=place,locality,neighborhood,address&limit=5`;
      
      const response = await fetch(endpoint);
      const data = await response.json();
      
      if (data.features) {
        setSuggestions(data.features);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    searchLocation(newValue);
  };

  const handleSelectSuggestion = (place: any) => {
    onChange(place.place_name);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full">
      <Input
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="border-none bg-transparent placeholder:text-gray-400 focus-visible:ring-0 text-black w-full"
        onFocus={() => value && suggestions.length > 0 && setShowSuggestions(true)}
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="p-2 hover:bg-gray-100 cursor-pointer text-black text-sm"
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              {suggestion.place_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationInput;
