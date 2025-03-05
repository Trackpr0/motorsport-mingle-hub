
import React from "react";
import { useParams } from "react-router-dom";
import ProfileHeader from "@/components/profile/ProfileHeader";
import BusinessProfile from "@/components/profile/BusinessProfile";
import EnthusiastProfile from "@/components/profile/EnthusiastProfile";
import { useProfileData } from "@/hooks/useProfileData";
import FooterNav from "@/components/navigation/FooterNav";

const Profile = () => {
  const { 
    username, 
    avatarUrl, 
    isLoading, 
    userType, 
    businessName, 
    userId,
    posts,
    events,
    loadingPosts
  } = useProfileData();

  return (
    <div className="min-h-screen bg-[#F8F9FE] pb-20">
      <ProfileHeader />
      
      {userType === "business" ? (
        <BusinessProfile 
          isLoading={isLoading}
          businessName={businessName}
          avatarUrl={avatarUrl}
          posts={posts}
          events={events || []}
          loadingPosts={loadingPosts}
          isOwnProfile={true}
          userId={userId}
        />
      ) : (
        <EnthusiastProfile 
          isLoading={isLoading}
          username={username}
          avatarUrl={avatarUrl}
          posts={posts}
          loadingPosts={loadingPosts}
          isOwnProfile={true}
        />
      )}
      
      <FooterNav />
    </div>
  );
};

export default Profile;
