
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

interface BusinessPostProps {
  name: string;
  location: string;
  rating: number;
  imageUrl: string;
  description: string;
  hasEvent: boolean;
  profileId?: string | null;
  avatarUrl?: string | null;
}

const BusinessPost = ({ 
  name, 
  location, 
  rating, 
  imageUrl, 
  description, 
  hasEvent, 
  profileId,
  avatarUrl 
}: BusinessPostProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={name} />
            ) : (
              <AvatarFallback className="bg-gray-200">
                {name.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col items-start">
            <button className="font-semibold text-gray-900 hover:text-gray-700 transition-colors">
              {name}
            </button>
            <span className="text-sm text-gray-500">{location}</span>
          </div>
        </div>
        <button className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          <span className="font-semibold text-gray-900 text-sm">{rating}</span>
          <img 
            src="/lovable-uploads/a86b6920-93c3-43b5-8070-36cd7514b1d1.png" 
            alt="Tire Rating" 
            className="w-6 h-5"
          />
        </button>
      </div>
      
      <img src={imageUrl} alt="" className="w-full aspect-[4/3] object-cover" />
      
      <div className="p-4 space-y-4">
        <p className="text-gray-700">{description}</p>
        
        {hasEvent && (
          <button className="w-full bg-blue-600 text-white font-medium py-3 rounded-xl hover:bg-blue-700 transition-colors">
            Purchase Ticket
          </button>
        )}
        
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

export default BusinessPost;
