
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
  const [userType, setUserType] = useState<string>("enthusiast");
  const [businessName, setBusinessName] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
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

  // Render business profile view
  const renderBusinessProfile = () => {
    return (
      <>
        <div className="max-w-md mx-auto p-4">
          <div className="flex items-start gap-4 mb-6">
            <Avatar className="w-24 h-24">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={businessName} />
              ) : (
                <AvatarFallback>
                  <User className="w-12 h-12" />
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-black">
                {isLoading ? "Loading..." : businessName}
              </h2>
              <p className="text-gray-500">{businessName}</p>
              <Button className="bg-blue-600 hover:bg-blue-700">EDIT PROFILE</Button>
            </div>
          </div>

          {/* Business Location */}
          <div className="space-y-4 mb-6">
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-medium mb-2 text-black">Location</h3>
              <p className="text-gray-600">No location set</p>
            </div>
          </div>

          {/* Create Event Button */}
          <div className="mb-6">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              CREATE EVENT
            </Button>
          </div>
        </div>

        <Tabs defaultValue="posts" className="w-full mt-6">
          <TabsList className="max-w-md mx-auto w-full flex justify-around bg-transparent">
            <TabsTrigger 
              value="posts" 
              className="flex-1 data-[state=active]:bg-gray-100 transition-colors text-black"
            >
              <User className="w-5 h-5" />
            </TabsTrigger>
            <TabsTrigger 
              value="events" 
              className="flex-1 data-[state=active]:bg-gray-100 transition-colors text-black"
            >
              <Timer className="w-5 h-5" />
            </TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="max-w-md mx-auto p-4">
            <div className="flex flex-col items-center justify-center h-48 text-gray-500 font-medium">
              Go to the Track
            </div>
          </TabsContent>
          <TabsContent value="events" className="max-w-md mx-auto p-4">
            <div className="flex flex-col items-center justify-center h-48 gap-4">
              <Timer className="w-12 h-12 text-gray-400" />
              <Button size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700">
                +
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </>
    );
  };

  // Render enthusiast (regular user) profile view
  const renderEnthusiastProfile = () => {
    return (
      <>
        <div className="max-w-md mx-auto p-4">
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
              <h2 className="text-xl font-semibold text-black">
                {isLoading ? "Loading..." : username}
              </h2>
              <Button className="bg-blue-600 hover:bg-blue-700">EDIT PROFILE</Button>
            </div>
          </div>

          {/* Trophies Section */}
          <div className="space-y-4 mb-6">
            <Button 
              variant="ghost" 
              className="w-full flex justify-between items-center px-0 hover:bg-transparent text-black"
              onClick={() => {/* Trophy page navigation will be implemented later */}}
            >
              <span className="text-lg">Trophies</span>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Primary Vehicle */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg text-black">Primary Vehicle</span>
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
          <TabsList className="max-w-md mx-auto w-full flex justify-around bg-transparent">
            <TabsTrigger 
              value="posts" 
              className="flex-1 data-[state=active]:bg-gray-100 transition-colors text-black"
            >
              <User className="w-5 h-5" />
            </TabsTrigger>
            <TabsTrigger 
              value="laptimes" 
              className="flex-1 data-[state=active]:bg-gray-100 transition-colors text-black"
            >
              <Timer className="w-5 h-5" />
            </TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="max-w-md mx-auto p-4">
            <div className="flex flex-col items-center justify-center h-48 text-gray-500 font-medium">
              Go to the Track
            </div>
          </TabsContent>
          <TabsContent value="laptimes" className="max-w-md mx-auto p-4">
            <div className="flex flex-col items-center justify-center h-48 gap-4">
              <Timer className="w-12 h-12 text-gray-400" />
              <Button size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700">
                +
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </>
    );
  };

  return (
    <div className="min-h-screen pb-20 bg-[#F8F9FE]">
      <div className="sticky top-0 z-10 bg-white p-4 shadow-sm">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black">Profile</h1>
          <div className="flex items-center gap-4">
            <button className="relative" onClick={handleNotificationsClick}>
              <Bell className="w-6 h-6 text-gray-700" />
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                2
              </span>
            </button>
            <button className="relative" onClick={handleMessagesClick}>
              <MessageSquare className="w-6 h-6 text-gray-700" />
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                5
              </span>
            </button>
            <button onClick={handleSettingsClick}>
              <Settings className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Conditionally render the appropriate profile type */}
      {userType === 'business' ? renderBusinessProfile() : renderEnthusiastProfile()}

      {/* Navigation Footer */}
      <FooterNav />
    </div>
  );
};

export default Profile;
