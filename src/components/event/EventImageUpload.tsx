
import { Image } from "lucide-react";

interface EventImageUploadProps {
  imageUrl: string | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const EventImageUpload = ({
  imageUrl,
  onFileChange,
}: EventImageUploadProps) => {
  return (
    <div 
      className="w-full h-full border-none rounded-lg flex flex-col items-center justify-center cursor-pointer"
      onClick={() => document.getElementById("event-image-upload")?.click()}
    >
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt="Event preview" 
          className="w-full h-full object-cover rounded-lg"
        />
      ) : (
        <div className="text-center">
          <div className="bg-blue-200 rounded-lg p-4 inline-block">
            <Image className="h-8 w-8 text-blue-600" />
          </div>
          <p className="mt-2 text-gray-500">Add Image</p>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="hidden"
        id="event-image-upload"
      />
    </div>
  );
};
