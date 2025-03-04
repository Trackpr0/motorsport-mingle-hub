
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useProfileData = () => {
  const [username, setUsername] = useState<string>("Loading...");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<string>("enthusiast");
  const [businessName, setBusinessName] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setUserId(session.user.id);
          
          const { data, error } = await supabase
            .from('enthusiast_profiles')
            .select('username, avatar_url, user_type, first_name')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error('Error fetching profile:', error);
          } else if (data) {
            if (data.user_type === 'business') {
              setBusinessName(data.first_name || 'No business name set');
              setUsername(data.first_name || 'No business name set');
            } else {
              setUsername(data.username || 'No username set');
            }
            setUserType(data.user_type || 'enthusiast');
            setAvatarUrl(data.avatar_url);
          }
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!userId) return;
      
      try {
        setLoadingPosts(true);
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
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching user posts:', error);
          toast.error('Could not load posts');
        } else if (data) {
          setPosts(data);
        }
      } catch (error) {
        console.error('Unexpected error fetching posts:', error);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchUserPosts();
    
    if (userId) {
      const channel = supabase
        .channel('profile-posts-channel')
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'posts',
            filter: `user_id=eq.${userId}`
          }, 
          (payload) => {
            setPosts(current => [payload.new, ...current]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [userId]);

  return {
    username,
    avatarUrl,
    isLoading,
    userType,
    businessName,
    userId,
    posts,
    loadingPosts
  };
};
