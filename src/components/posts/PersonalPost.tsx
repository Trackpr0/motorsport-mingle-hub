
import { Heart, MessageCircle, Share2, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

interface PersonalPostProps {
  name: string;
  imageUrl: string;
  description: string;
  profileId?: string | null;
  avatarUrl?: string | null;
}

const PersonalPost = ({ 
  name, 
  imageUrl, 
  description, 
  profileId,
  avatarUrl
}: PersonalPostProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4 flex items-center">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={name} />
            ) : (
              <AvatarFallback className="bg-gray-200">
                <User className="w-6 h-6 text-gray-400" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col items-start">
            <button className="font-semibold text-gray-900 hover:text-gray-700 transition-colors">
              {name}
            </button>
          </div>
        </div>
      </div>
      
      <img src={imageUrl} alt="" className="w-full aspect-[4/3] object-cover" />
      
      <div className="p-4 space-y-4">
        <p className="text-gray-700">{description}</p>
        
        <div className="flex justify-between items-center pt-2">
          <button className="flex items-center gap-2 text-gray-600">
            <Heart className="w-6 h-6" />
            <span>LIKE</span>
          </button>
          <button className="flex items-center gap-2 text-gray-600">
            <MessageCircle className="w-6 h-6" />
            <span>COMMENT</span>
          </button>
          <button className="flex items-center gap-2 text-gray-600">
            <Share2 className="w-6 h-6" />
            <span>SHARE</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalPost;
