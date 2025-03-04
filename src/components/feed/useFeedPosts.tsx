
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

  return { posts, loading };
};
