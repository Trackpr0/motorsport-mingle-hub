
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Image } from "lucide-react";

interface BusinessProfilePictureUploadProps {
  avatarUrl: string | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BusinessProfilePictureUpload = ({
  avatarUrl,
  onFileChange,
}: BusinessProfilePictureUploadProps) => {
  return (
    <div 
      className="w-full h-[180px] border border-blue-600 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-gray-100"
      onClick={() => document.getElementById("business-avatar-upload")?.click()}
    >
      {avatarUrl ? (
        <Avatar className="w-16 h-16 mb-2">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="bg-gray-200">
            <Image className="w-8 h-8 text-gray-400" />
          </AvatarFallback>
        </Avatar>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <div className="bg-gray-200 rounded p-2 mb-2">
            <Image className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      )}
      <span className="text-gray-500 text-sm">Upload Business Profile Picture</span>
      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="hidden"
        id="business-avatar-upload"
      />
    </div>
  );
};
