
import { User, ChevronRight, Timer } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostsGrid from "./PostsGrid";

interface EnthusiastProfileProps {
  isLoading: boolean;
  username: string;
  avatarUrl: string | null;
  posts: any[];
  loadingPosts: boolean;
  isOwnProfile: boolean; // Added this prop to match what's being passed in Profile.tsx
}

const EnthusiastProfile = ({ 
  isLoading, 
  username, 
  avatarUrl, 
  posts,
  loadingPosts,
  isOwnProfile 
}: EnthusiastProfileProps) => {
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
            {isOwnProfile && (
              <Button className="bg-blue-600 hover:bg-blue-700">EDIT PROFILE</Button>
            )}
          </div>
        </div>

        {isOwnProfile && (
          <>
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
          </>
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
            value="laptimes" 
            className="flex-1 data-[state=active]:bg-gray-100 transition-colors text-black"
          >
            <Timer className="w-5 h-5" />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="max-w-md mx-auto">
          <PostsGrid posts={posts} loading={loadingPosts} />
        </TabsContent>
        <TabsContent value="laptimes" className="max-w-md mx-auto p-4">
          <div className="flex flex-col items-center justify-center h-48 gap-4">
            <Timer className="w-12 h-12 text-gray-400" />
            {isOwnProfile && (
              <Button size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700">
                +
              </Button>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default EnthusiastProfile;
