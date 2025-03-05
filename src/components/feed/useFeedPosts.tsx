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
        const { data: { session } } = await supabase.auth.getSession();
        
        let query = supabase
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
        
        if (session) {
          const { data: userMemberships, error: membershipError } = await supabase
            .from('user_memberships')
            .select('membership_id')
            .eq('user_id', session.user.id);
            
          if (!membershipError && userMemberships && userMemberships.length > 0) {
            const membershipIds = userMemberships.map(m => m.membership_id);
            query = query.or(`membership_id.is.null,membership_id.in.(${membershipIds.join(',')})`);
          } else {
            query = query.is('membership_id', null);
          }
        } else {
          query = query.is('membership_id', null);
        }
        
        const { data, error } = await query;
        
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
          
          const fetchPostWithProfile = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (payload.new.membership_id) {
              if (!session) return;
              
              const { data: membership, error } = await supabase
                .from('user_memberships')
                .select('id')
                .eq('user_id', session.user.id)
                .eq('membership_id', payload.new.membership_id)
                .maybeSingle();
                
              if (error || !membership) return;
            }
            
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
