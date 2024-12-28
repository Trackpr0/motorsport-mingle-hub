import { Settings, MessageSquare, ChevronRight, User, Timer } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FooterNav from "@/components/navigation/FooterNav";

const Profile = () => {
  return (
    <div className="min-h-screen pb-20 bg-white text-black">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">Profile</h1>
        <div className="flex gap-4">
          <Settings className="w-6 h-6" />
          <div className="relative">
            <MessageSquare className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              2
            </span>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="p-4">
        <div className="flex items-start gap-4 mb-6">
          <Avatar className="w-24 h-24">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>
              <User className="w-12 h-12" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">Person's Name</h2>
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
