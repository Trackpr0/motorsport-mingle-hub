import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface ProfilePictureUploadProps {
  avatarUrl: string | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfilePictureUpload = ({
  avatarUrl,
  onFileChange,
}: ProfilePictureUploadProps) => {
  return (
    <div 
      className="w-full h-[200px] border-2 border-blue-600 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer bg-gray-50"
      onClick={() => document.getElementById("avatar-upload")?.click()}
    >
      <Avatar className="w-16 h-16 mb-2">
        <AvatarImage src={avatarUrl || ""} />
        <AvatarFallback className="bg-gray-200">
          <User className="w-8 h-8 text-gray-400" />
        </AvatarFallback>
      </Avatar>
      <span className="text-gray-500">Upload Profile Picture (Optional)</span>
      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="hidden"
        id="avatar-upload"
      />
    </div>
  );
};