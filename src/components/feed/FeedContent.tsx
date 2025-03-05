
import React from "react";
import BusinessPost from "../posts/BusinessPost";
import PersonalPost from "../posts/PersonalPost";
import { Lock } from "lucide-react";

interface FeedContentProps {
  posts: any[];
  loading: boolean;
}

const FeedContent: React.FC<FeedContentProps> = ({ posts, loading }) => {
  if (loading) {
    return <div className="text-center py-8">Loading posts...</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-500 font-medium">
        No posts yet. Be the first to share something!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => {
        // Determine if this is a business post
        const isBusinessPost = post.type === "business" || 
                              post.enthusiast_profiles?.user_type === "business";
        
        // Determine if this is a members-only post
        const isMembersOnly = post.membership_id !== null;
        
        return isBusinessPost ? (
          <BusinessPost
            key={post.id}
            name={post.enthusiast_profiles?.first_name || 
                 post.enthusiast_profiles?.full_name || 
                 "Business Account"}
            location={post.location || ""}
            rating={4.5}
            imageUrl={post.image_url}
            description={post.caption || ""}
            hasEvent={post.has_event}
            profileId={post.user_id}
            avatarUrl={post.enthusiast_profiles?.avatar_url}
            isMembersOnly={isMembersOnly}
          />
        ) : (
          <PersonalPost
            key={post.id}
            name={post.enthusiast_profiles?.username || 
                 post.enthusiast_profiles?.full_name || 
                 "Personal Account"}
            imageUrl={post.image_url}
            description={post.caption || ""}
            profileId={post.user_id}
            avatarUrl={post.enthusiast_profiles?.avatar_url}
          />
        );
      })}
    </div>
  );
};

export default FeedContent;
