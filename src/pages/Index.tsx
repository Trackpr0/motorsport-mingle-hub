
import { useEffect, useState } from "react";
import Header from "../components/navigation/Header";
import FooterNav from "../components/navigation/FooterNav";
import BusinessPost from "../components/posts/BusinessPost";
import PersonalPost from "../components/posts/PersonalPost";
import { supabase } from "../integrations/supabase/client";
import { toast } from "../components/ui/use-toast";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  
  useEffect(() => {
    // Fetch posts and set up real-time subscription
    const fetchPosts = async () => {
      try {
        setLoading(true);
        
        // Fetch posts with user profiles
        const { data, error } = await supabase
          .from('posts')
          .select(`
            *,
            enthusiast_profiles (
              username,
              full_name,
              avatar_url
            )
          `)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (data) {
          setPosts(data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast({
          title: "Error fetching posts",
          description: "Could not load posts. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

    // Set up real-time subscription
    const channel = supabase
      .channel('posts-channel')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'posts' 
        }, 
        (payload) => {
          setPosts(current => [payload.new, ...current]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FE] pb-20">
      <Header />
      
      <main className="max-w-md mx-auto p-4 space-y-6">
        {loading ? (
          <div className="text-center py-8">Loading posts...</div>
        ) : (
          posts.map((post) => (
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
          ))
        )}
      </main>

      <FooterNav />
    </div>
  );
};

export default Index;
