
import React from "react";
import BusinessPost from "../posts/BusinessPost";
import PersonalPost from "../posts/PersonalPost";

interface FeedContentProps {
  posts: any[];
  loading: boolean;
}

const FeedContent: React.FC<FeedContentProps> = ({ posts, loading }) => {
  if (loading) {
    return <div className="text-center py-8">Loading posts...</div>;
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        post.type === "business" ? (
          <BusinessPost
            key={post.id}
            name={post.enthusiast_profiles?.full_name || post.enthusiast_profiles?.username || "Business Account"}
            location={post.location || ""}
            rating={4.5}
            imageUrl={post.image_url}
            description={post.caption || ""}
            hasEvent={post.has_event}
            profileId={post.user_id}
          />
        ) : (
          <PersonalPost
            key={post.id}
            name={post.enthusiast_profiles?.username || post.enthusiast_profiles?.full_name || "Personal Account"}
            imageUrl={post.image_url}
            description={post.caption || ""}
            profileId={post.user_id}
          />
        )
      ))}
    </div>
  );
};

export default FeedContent;
