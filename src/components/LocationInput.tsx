
import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Input } from "@/components/ui/input";

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  mapboxToken?: string;
}

// Default token - in production, this should be replaced with a proper token
const DEFAULT_MAPBOX_TOKEN = "pk.eyJ1IjoibG92YWJsZWRldiIsImEiOiJjbG9iZ2ZmdGswMWhtMmtwaDQzN2NlMXQ3In0.WdOqUosdZJERZBpJn12DAQ";

const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChange,
  placeholder = "Enter city, state, or location...",
  mapboxToken
}) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [tokenError, setTokenError] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  // Use provided token or fall back to default
  const token = mapboxToken || DEFAULT_MAPBOX_TOKEN;
  
  // Set the token for mapboxgl
  useEffect(() => {
    try {
      mapboxgl.accessToken = token;
      setTokenError(false);
    } catch (error) {
      console.error("Error setting Mapbox token:", error);
      setTokenError(true);
    }
  }, [token]);

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
      )}.json?access_token=${token}&types=place,locality,neighborhood,address&limit=5`;
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.features) {
        setSuggestions(data.features);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
      setTokenError(true);
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
      
      {tokenError && (
        <div className="text-red-500 text-xs mt-1">
          There was an issue with the Mapbox token. Location suggestions may not work correctly.
        </div>
      )}
      
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
