
import React, { useState } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import LocationInput from "@/components/LocationInput";
import { supabase } from "@/integrations/supabase/client";

const PostDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [caption, setCaption] = useState("");
  const [locationText, setLocationText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const selectedImage = location.state?.selectedImage;

  const handleBack = () => {
    navigate(-1);
  };

  const handleConfirmPost = async () => {
    try {
      setIsSubmitting(true);
      
      // Get the current user's session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("You must be logged in to create a post");
        return;
      }

      // Get the user profile to determine if it's a business or personal account
      const { data: profileData } = await supabase
        .from('enthusiast_profiles')
        .select('user_type')
        .eq('id', session.user.id)
        .single();

      const postType = profileData?.user_type === 'business' ? 'business' : 'personal';

      // Create the post in Supabase
      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: session.user.id,
          caption,
          location: locationText,
          image_url: selectedImage,
          type: postType,
          has_event: false
        });

      if (error) throw error;

      toast.success("Post created successfully!");
      navigate("/home");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedImage) {
    navigate("/create-post");
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <button onClick={handleBack} className="text-black">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold">Post Details</h1>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 flex flex-col p-4 space-y-4">
        <div className="w-full aspect-video bg-gray-100 flex items-center justify-center overflow-hidden rounded-md">
          <img 
            src={selectedImage} 
            alt="Selected media" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <label className="text-blue-600 font-medium block mb-2">Caption</label>
          <Input 
            placeholder="Enter here..." 
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="border-none bg-transparent placeholder:text-gray-400 focus-visible:ring-0 text-black"
          />
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <label className="text-blue-600 font-medium block mb-2">Location</label>
          <LocationInput 
            value={locationText}
            onChange={setLocationText}
            mapboxToken="pk.eyJ1IjoidHJhY2todWJsbGMiLCJhIjoiY203dHozcWd4MGN0ejJqcHFwNDBzd3l5OCJ9.QFkcZKkOyJzECS5PwYzT7Q"
          />
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <label className="text-blue-600 font-medium block mb-2">
            Attach Trackday Event (Optional)
          </label>
          <button className="flex items-center justify-between w-full text-black py-1 px-2 bg-white rounded">
            <span>Select Event</span>
            <ChevronDown size={20} />
          </button>
        </div>
        
        <div className="mt-auto pt-4">
          <Button 
            onClick={handleConfirmPost}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 rounded-xl"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Post..." : "Confirm Post"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
