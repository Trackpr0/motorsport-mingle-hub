
import { useState, useEffect } from "react";
import { Settings, MessageSquare, ChevronRight, User, Timer, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FooterNav from "@/components/navigation/FooterNav";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Profile = () => {
  const [username, setUsername] = useState<string>("Loading...");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data, error } = await supabase
            .from('enthusiast_profiles')
            .select('username, avatar_url')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error('Error fetching profile:', error);
          } else if (data) {
            setUsername(data.username || 'No username set');
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

  const handleSettingsClick = () => {
    toast.info("Settings clicked");
    // Navigate to settings page when implemented
    // navigate("/settings");
  };

  const handleMessagesClick = () => {
    toast.info("Messages clicked");
    // Navigate to messages page when implemented
    // navigate("/messages");
  };

  const handleNotificationsClick = () => {
    toast.info("Notifications clicked");
    // Navigate to notifications page when implemented
    // navigate("/notifications");
  };

  return (
    <div className="min-h-screen pb-20 bg-white text-black">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">Profile</h1>
        <div className="flex gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 p-0" 
            onClick={handleSettingsClick}
          >
            <Settings className="w-6 h-6" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 p-0 relative" 
            onClick={handleNotificationsClick}
          >
            <Bell className="w-6 h-6 text-gray-700" />
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              2
            </span>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 p-0 relative" 
            onClick={handleMessagesClick}
          >
            <MessageSquare className="w-6 h-6 text-gray-700" />
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              5
            </span>
          </Button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="p-4">
        <div className="flex items-start gap-4 mb-6">
          <Avatar className="w-24 h-24">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={username} />
            ) : (
              <AvatarFallback>
                <User className="w-12 h-12" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">
              {isLoading ? "Loading..." : username}
            </h2>
            <Button className="bg-blue-600 hover:bg-blue-700">EDIT PROFILE</Button>
          </div>
        </div>

        {/* Trophies Section */}
        <div className="space-y-4 mb-6">
          <Button 
            variant="ghost" 
            className="w-full flex justify-between items-center px-0 hover:bg-transparent"
            onClick={() => {/* Trophy page navigation will be implemented later */}}
          >
            <span className="text-lg">Trophies</span>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Primary Vehicle */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-lg">Primary Vehicle</span>
            <Button variant="link" className="text-blue-600 p-0">
              My Garage <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex flex-col items-center justify-center text-gray-400">
              <p>No primary vehicle selected</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="posts" className="w-full mt-6">
        <TabsList className="w-full flex justify-around bg-transparent">
          <TabsTrigger 
            value="posts" 
            className="flex-1 data-[state=active]:bg-gray-100 transition-colors"
          >
            <User className="w-5 h-5" />
          </TabsTrigger>
          <TabsTrigger 
            value="laptimes" 
            className="flex-1 data-[state=active]:bg-gray-100 transition-colors"
          >
            <Timer className="w-5 h-5" />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="p-4">
          <div className="flex flex-col items-center justify-center h-48 text-gray-500 font-medium">
            Go to the Track
          </div>
        </TabsContent>
        <TabsContent value="laptimes" className="p-4">
          <div className="flex flex-col items-center justify-center h-48 gap-4">
            <Timer className="w-12 h-12 text-gray-400" />
            <Button size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700">
              +
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Navigation Footer */}
      <FooterNav />
    </div>
  );
};

export default Profile;
