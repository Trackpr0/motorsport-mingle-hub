
import { useEffect, useState } from "react";
import Header from "../components/navigation/Header";
import FooterNav from "../components/navigation/FooterNav";
import BusinessPost from "../components/posts/BusinessPost";
import PersonalPost from "../components/posts/PersonalPost";
import { supabase } from "../integrations/supabase/client";
import { toast } from "../components/ui/use-toast";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<any[]>([]);
  
  useEffect(() => {
    async function fetchProfiles() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('enthusiast_profiles')
          .select('*')
          .limit(5);
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setProfiles(data);
          console.log("Fetched profiles:", data);
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
        toast({
          title: "Error fetching profiles",
          description: "Could not load user data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchProfiles();
  }, []);

  // Sample data - in a real app, this would come from your backend
  const posts = [
    {
      type: "business",
      profileId: profiles.length > 0 ? profiles[0].id : null,
      name: profiles.length > 0 ? profiles[0].full_name || profiles[0].username || "Business Account" : "Business Name",
      location: "122 Sample Street, GA, US, 12311",
      rating: 4.5,
      imageUrl: "https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?auto=format&fit=crop&q=80",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore",
      hasEvent: true,
    },
    {
      type: "personal",
      profileId: "trackdaypro", // Set this to "trackdaypro" for the personal post
      name: "trackdaypro", // Use "trackdaypro" for the name
      imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80",
      description: "Check out my new ride! Ready for the track day 🏎️",
      hasEvent: false,
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FE] pb-20">
      <Header />
      
      <main className="max-w-md mx-auto p-4 space-y-6">
        {loading ? (
          <div className="text-center py-8">Loading posts...</div>
        ) : (
          posts.map((post, index) => (
            post.type === "business" ? (
              <BusinessPost
                key={index}
                name={post.name}
                location={post.location}
                rating={post.rating}
                imageUrl={post.imageUrl}
                description={post.description}
                hasEvent={post.hasEvent}
                profileId={post.profileId}
              />
            ) : (
              <PersonalPost
                key={index}
                name={post.name}
                imageUrl={post.imageUrl}
                description={post.description}
                profileId={post.profileId}
              />
            )
          ))
        )}
      </main>

      <FooterNav />
    </div>
  );
};

export default Index;
