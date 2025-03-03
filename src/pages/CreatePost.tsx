import React, { useRef, useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CreatePost = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleNext = () => {
    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }
    
    // Navigate to post details page with the selected image
    navigate("/post-details", { state: { selectedImage } });
  };

  const openGallery = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <button onClick={handleBack} className="text-black">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold">Select Media</h1>
        <Button 
          onClick={handleNext} 
          variant="ghost" 
          className="text-blue-600 font-medium"
          disabled={!selectedImage}
        >
          Next
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Selected Image Preview */}
        <div 
          className="w-full aspect-square bg-gray-100 flex items-center justify-center overflow-hidden"
          onClick={openGallery}
        >
          {selectedImage ? (
            <img 
              src={selectedImage} 
              alt="Selected media" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-4">
              <p className="text-gray-500">Tap to select an image from your gallery</p>
            </div>
          )}
        </div>
        
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />

        {/* Gallery Section */}
        <div className="mt-auto p-2 border-t">
          <div className="grid grid-cols-3 gap-1">
            {/* This would typically be populated with actual gallery images */}
            {Array(6).fill(0).map((_, index) => (
              <div 
                key={index}
                className="aspect-square bg-gray-200 rounded-sm relative"
                onClick={openGallery}
              >
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white flex items-center justify-center border border-gray-300">
                  {index === 0 && <Check size={14} className="text-blue-600" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
