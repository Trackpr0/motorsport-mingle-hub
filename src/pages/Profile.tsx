import { Settings, MessageSquare, ChevronRight, User, Stopwatch } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Profile = () => {
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
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

        {/* Recognition Badges */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-lg">Recognition Badges</span>
            <ChevronRight className="w-5 h-5" />
          </div>
          <div className="flex gap-2">
            {/* Placeholder badges */}
            <div className="w-8 h-8 bg-yellow-500 rounded-full"></div>
            <div className="w-8 h-8 bg-yellow-500 rounded-full"></div>
            <div className="w-8 h-8 bg-yellow-500 rounded-full"></div>
          </div>
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
            <img 
              src="/placeholder.svg" 
              alt="Primary Vehicle" 
              className="w-full h-32 object-cover rounded-lg mb-3"
            />
            <div className="space-y-1">
              <p className="font-medium">Car Make</p>
              <p className="text-sm text-gray-600">Car Model</p>
              <p className="text-sm text-gray-600">Car Year</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="posts" className="w-full mt-6">
        <TabsList className="w-full flex justify-around bg-transparent">
          <TabsTrigger value="posts" className="flex-1">
            <User className="w-5 h-5" />
          </TabsTrigger>
          <TabsTrigger value="laptimes" className="flex-1">
            <Stopwatch className="w-5 h-5" />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="p-4">
          <div className="grid grid-cols-3 gap-1">
            {/* Placeholder posts */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-sm"></div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="laptimes" className="p-4">
          <div className="flex flex-col items-center justify-center h-48 gap-4">
            <Stopwatch className="w-12 h-12 text-gray-400" />
            <Button size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700">
              +
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;