
import { useState } from "react";

export const useEventImageUpload = () => {
  const [eventImage, setEventImage] = useState<string | null>(null);
  
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
  
  return {
    eventImage,
    setEventImage,
    handleFileChange
  };
};
