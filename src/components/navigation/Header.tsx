import { Bell, MessageSquare } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-10 bg-white p-4 shadow-sm">
      <div className="max-w-md mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Feed</h1>
        <div className="flex items-center gap-4">
          <button className="relative">
            <Bell className="w-6 h-6 text-gray-700" />
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              2
            </span>
          </button>
          <button className="relative">
            <MessageSquare className="w-6 h-6 text-gray-700" />
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              5
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;