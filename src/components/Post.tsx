import { Heart, MessageCircle, Share2 } from "lucide-react";

interface PostProps {
  username: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
}

const Post = ({ username, imageUrl, caption, likes, comments }: PostProps) => {
  return (
    <div className="bg-white/5 rounded-xl overflow-hidden backdrop-blur-lg border border-white/10 mb-4 animate-fade-in">
      <div className="p-4 flex items-center space-x-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-motorsport-blue to-motorsport-purple" />
        <span className="font-semibold text-white">{username}</span>
      </div>
      
      <img src={imageUrl} alt={caption} className="w-full h-96 object-cover" />
      
      <div className="p-4 space-y-2">
        <div className="flex space-x-4">
          <button className="flex items-center space-x-1 text-white/70 hover:text-motorsport-pink transition-colors">
            <Heart className="w-6 h-6" />
            <span>{likes}</span>
          </button>
          <button className="flex items-center space-x-1 text-white/70 hover:text-motorsport-pink transition-colors">
            <MessageCircle className="w-6 h-6" />
            <span>{comments}</span>
          </button>
          <button className="flex items-center space-x-1 text-white/70 hover:text-motorsport-pink transition-colors ml-auto">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
        <p className="text-white">
          <span className="font-semibold">{username}</span> {caption}
        </p>
      </div>
    </div>
  );
};

export default Post;