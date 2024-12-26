import { Bell, MessageSquare, Heart, MessageCircle, Share2, Home, Ticket, PlusSquare, Search, User } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const posts = [
    {
      type: "business",
      name: "Business Name",
      location: "122 Sample Street, GA, US, 12311",
      rating: 4.5,
      imageUrl: "https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?auto=format&fit=crop&q=80",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore",
      hasEvent: true,
    },
    {
      type: "personal",
      name: "Persons Name",
      imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80",
      description: "Check out my new ride! Ready for the track day 🏎️",
      hasEvent: false,
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FE] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white p-4 shadow-sm">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Feed</h1>
          <div className="flex items-center gap-4">
            <button className="relative">
              <Bell className="w-6 h-6 text-gray-700" />
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">2</span>
            </button>
            <button className="relative">
              <MessageSquare className="w-6 h-6 text-gray-700" />
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">5</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto p-4 space-y-6">
        {posts.map((post, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Post Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                  <img src="/placeholder.svg" alt="Profile" className="w-full h-full object-cover" />
                </button>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-900">{post.name}</span>
                  {post.location && (
                    <span className="text-sm text-gray-500">{post.location}</span>
                  )}
                </div>
              </div>
              {post.type === "business" && (
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-gray-900">{post.rating}</span>
                  <img src="/placeholder.svg" alt="Rating" className="w-5 h-5" />
                </div>
              )}
            </div>
            
            {/* Post Image */}
            <img src={post.imageUrl} alt="" className="w-full aspect-[4/3] object-cover" />
            
            {/* Post Content */}
            <div className="p-4 space-y-4">
              <p className="text-gray-700">{post.description}</p>
              
              {post.type === "business" && (
                <>
                  <button className="text-blue-600 font-medium">See Business Reviews</button>
                  <button className="w-full bg-blue-600 text-white font-medium py-3 rounded-xl hover:bg-blue-700 transition-colors">
                    Purchase Ticket
                  </button>
                </>
              )}
              
              {/* Post Actions */}
              <div className="flex justify-between items-center pt-2">
                <button className="flex items-center gap-2 text-gray-600">
                  <Heart className="w-6 h-6" />
                  <span>LIKE</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600">
                  <MessageCircle className="w-6 h-6" />
                  <span>COMMENT</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600">
                  <Share2 className="w-6 h-6" />
                  <span>SHARE</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Footer Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2">
        <div className="max-w-md mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="flex flex-col items-center text-blue-600">
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <button className="flex flex-col items-center text-gray-600">
            <Ticket className="w-6 h-6" />
            <span className="text-xs mt-1">Events</span>
          </button>
          <button className="flex flex-col items-center -mt-8">
            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
              <PlusSquare className="w-7 h-7 text-white" />
            </div>
          </button>
          <button className="flex flex-col items-center text-gray-600">
            <Search className="w-6 h-6" />
            <span className="text-xs mt-1">Search</span>
          </button>
          <button className="flex flex-col items-center text-gray-600">
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Index;