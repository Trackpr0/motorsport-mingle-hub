
import { useEffect, useState } from "react";
import { supabase } from "../../integrations/supabase/client";
import { toast } from "../../components/ui/use-toast";

export const useFeedPosts = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('posts')
          .select(`
            *,
            enthusiast_profiles (
              username,
              full_name,
              avatar_url,
              user_type,
              first_name
            )
          `)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (data) {
          console.log("Feed posts fetched:", data);
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

    // Set up realtime subscription for new posts
    const channel = supabase
      .channel('posts-channel')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'posts' 
        }, 
        (payload) => {
          console.log("New post received in realtime:", payload.new);
          
          // We need to fetch the related profile data for the new post
          const fetchPostWithProfile = async () => {
            const { data, error } = await supabase
              .from('posts')
              .select(`
                *,
                enthusiast_profiles (
                  username,
                  full_name,
                  avatar_url,
                  user_type,
                  first_name
                )
              `)
              .eq('id', payload.new.id)
              .single();
              
            if (error) {
              console.error("Error fetching new post details:", error);
            } else if (data) {
              setPosts(current => [data, ...current]);
            }
          };
          
          fetchPostWithProfile();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { posts, loading };
};
