
import { useNavigate } from "react-router-dom";
import FooterNav from "@/components/navigation/FooterNav";
import { useProfileData } from "@/hooks/useProfileData";
import ProfileHeader from "@/components/profile/ProfileHeader";
import BusinessProfile from "@/components/profile/BusinessProfile";
import EnthusiastProfile from "@/components/profile/EnthusiastProfile";

const Profile = () => {
  const navigate = useNavigate();
  const {
    username,
    avatarUrl,
    isLoading,
    userType,
    businessName,
    posts,
    loadingPosts
  } = useProfileData();

  return (
    <div className="min-h-screen pb-20 bg-[#F8F9FE]">
      <ProfileHeader />

      {userType === 'business' ? (
        <BusinessProfile
          isLoading={isLoading}
          businessName={businessName}
          avatarUrl={avatarUrl}
          posts={posts}
          loadingPosts={loadingPosts}
        />
      ) : (
        <EnthusiastProfile
          isLoading={isLoading}
          username={username}
          avatarUrl={avatarUrl}
          posts={posts}
          loadingPosts={loadingPosts}
        />
      )}

      <FooterNav />
    </div>
  );
};

export default Profile;
