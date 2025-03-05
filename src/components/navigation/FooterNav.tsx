import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, User, Star } from "lucide-react";

const FooterNav = () => {
  const location = useLocation();

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-2">
      <nav className="flex justify-around items-center max-w-md mx-auto">
        <Link to="/" className={`flex flex-col items-center ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-500'}`}>
          <Home className="h-6 w-6 mb-1" />
          Home
        </Link>
        <Link to="/search" className={`flex flex-col items-center ${location.pathname === '/search' ? 'text-blue-600' : 'text-gray-500'}`}>
          <Search className="h-6 w-6 mb-1" />
          Search
        </Link>
        {localStorage.getItem('userType') !== 'business' && (
          <Link to="/memberships" className={`flex flex-col items-center ${location.pathname === '/memberships' ? 'text-blue-600' : 'text-gray-500'}`}>
            <Star className="h-6 w-6 mb-1" />
            Memberships
          </Link>
        )}
        <Link to="/profile" className={`flex flex-col items-center ${location.pathname === '/profile' ? 'text-blue-600' : 'text-gray-500'}`}>
          <User className="h-6 w-6 mb-1" />
          Profile
        </Link>
      </nav>
    </footer>
  );
};

export default FooterNav;
