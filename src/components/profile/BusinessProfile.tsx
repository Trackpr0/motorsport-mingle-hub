
import { User, ChevronRight, Timer } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import PostsGrid from "./PostsGrid";
import { useNavigate } from "react-router-dom";

interface BusinessProfileProps {
  isLoading: boolean;
  businessName: string;
  avatarUrl: string | null;
  posts: any[];
  loadingPosts: boolean;
  isOwnProfile?: boolean;
  userId?: string | null;
}

const BusinessProfile = ({ 
  isLoading, 
  businessName, 
  avatarUrl, 
  posts,
  loadingPosts,
  isOwnProfile = false,
  userId
}: BusinessProfileProps) => {
  const navigate = useNavigate();
  
  const handleTicketHistoryClick = () => {
    toast.info("Ticket History feature will be implemented soon");
    // Navigate to ticket history page when implemented
    // navigate("/ticket-history");
  };
  
  const handleCreateEventClick = () => {
    navigate("/create-event");
  };

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
            {isOwnProfile && (
              <Button className="bg-blue-600 hover:bg-blue-700">EDIT PROFILE</Button>
            )}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-100 rounded-lg p-4">
            <h3 className="font-medium mb-2 text-black">Location</h3>
            <p className="text-gray-600">No location set</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-black">Tickets Sold</span>
            {isOwnProfile && (
              <Button 
                variant="link" 
                className="text-blue-600 p-0 flex items-center" 
                onClick={handleTicketHistoryClick}
              >
                Ticket History <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex flex-col items-center justify-center text-gray-400">
              <p>No ticket data available</p>
            </div>
          </div>
        </div>

        {isOwnProfile && (
          <div className="mb-6">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={handleCreateEventClick}
            >
              CREATE EVENT
            </Button>
          </div>
        )}
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
        <TabsContent value="posts" className="max-w-md mx-auto">
          <PostsGrid posts={posts} loading={loadingPosts} />
        </TabsContent>
        <TabsContent value="events" className="max-w-md mx-auto p-4">
          <div className="flex flex-col items-center justify-center h-48 gap-4">
            <Timer className="w-12 h-12 text-gray-400" />
            {isOwnProfile && (
              <Button 
                size="lg" 
                className="rounded-full bg-blue-600 hover:bg-blue-700"
                onClick={handleCreateEventClick}
              >
                +
              </Button>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default BusinessProfile;
