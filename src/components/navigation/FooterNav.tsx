
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, User, Plus, Ticket } from "lucide-react";

const FooterNav = () => {
  const location = useLocation();

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-2">
      <nav className="flex justify-around items-center max-w-md mx-auto">
        <Link to="/home" className={`flex flex-col items-center ${location.pathname === '/home' ? 'text-blue-600' : 'text-gray-500'}`}>
          <Home className="h-6 w-6 mb-1" />
          <span className="text-xs">Home</span>
        </Link>
        <Link to="/tickets" className={`flex flex-col items-center ${location.pathname === '/tickets' ? 'text-blue-600' : 'text-gray-500'}`}>
          <Ticket className="h-6 w-6 mb-1" />
          <span className="text-xs">Tickets</span>
        </Link>
        <Link to="/create-post" className="flex flex-col items-center">
          <div className="bg-blue-600 rounded-full p-3 -mt-5 mb-1 shadow-md">
            <Plus className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs text-gray-500">Post</span>
        </Link>
        <Link to="/search" className={`flex flex-col items-center ${location.pathname === '/search' ? 'text-blue-600' : 'text-gray-500'}`}>
          <Search className="h-6 w-6 mb-1" />
          <span className="text-xs">Search</span>
        </Link>
        <Link to="/profile" className={`flex flex-col items-center ${location.pathname === '/profile' ? 'text-blue-600' : 'text-gray-500'}`}>
          <User className="h-6 w-6 mb-1" />
          <span className="text-xs">Profile</span>
        </Link>
      </nav>
    </footer>
  );
};

export default FooterNav;
