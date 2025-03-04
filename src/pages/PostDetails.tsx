
import React, { useState } from "react";
import { ArrowLeft, Check, ChevronDown } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import LocationInput from "@/components/LocationInput";

interface PostDetailsProps {}

const PostDetails = ({}: PostDetailsProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [caption, setCaption] = useState("");
  const [locationText, setLocationText] = useState("");
  
  // Get the selectedImage from the location state
  const selectedImage = location.state?.selectedImage;

  const handleBack = () => {
    navigate(-1);
  };

  const handleConfirmPost = () => {
    // In a real app, this would submit the post to a backend
    toast.success("Post created successfully!");
    navigate("/home");
  };

  if (!selectedImage) {
    // If no image is selected, go back to create post
    navigate("/create-post");
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <button onClick={handleBack} className="text-black">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold">Post Details</h1>
        <div className="w-8"></div> {/* Spacer for alignment */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4 space-y-4">
        {/* Selected Image Preview */}
        <div className="w-full aspect-video bg-gray-100 flex items-center justify-center overflow-hidden rounded-md">
          <img 
            src={selectedImage} 
            alt="Selected media" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Caption Input */}
        <div className="bg-gray-50 p-4 rounded-md">
          <label className="text-blue-600 font-medium block mb-2">Caption</label>
          <Input 
            placeholder="Enter here..." 
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="border-none bg-transparent placeholder:text-gray-400 focus-visible:ring-0 text-black"
          />
        </div>
        
        {/* Location Input - For geolocation */}
        <div className="bg-gray-50 p-4 rounded-md">
          <label className="text-blue-600 font-medium block mb-2">Location</label>
          <LocationInput 
            value={locationText}
            onChange={setLocationText}
            // You can provide a custom token here if needed
            // mapboxToken="YOUR_MAPBOX_TOKEN"
          />
        </div>
        
        {/* Trackday Event Dropdown - Will show business created events */}
        <div className="bg-gray-50 p-4 rounded-md">
          <label className="text-blue-600 font-medium block mb-2">
            Attach Trackday Event (Optional)
          </label>
          <button className="flex items-center justify-between w-full text-black py-1 px-2 bg-white rounded">
            <span>Select Event</span>
            <ChevronDown size={20} />
          </button>
        </div>
        
        {/* Confirm Button */}
        <div className="mt-auto pt-4">
          <Button 
            onClick={handleConfirmPost}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 rounded-xl"
          >
            Confirm Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
