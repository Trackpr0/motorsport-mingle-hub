
import { Home, Ticket, PlusSquare, Search, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const FooterNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleCreatePost = () => {
    navigate("/create-post");
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2">
      <div className="max-w-md mx-auto px-4 flex justify-between items-center">
        <Link to="/home" className="flex flex-col items-center text-motorsport-blue">
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <button className="flex flex-col items-center text-motorsport-blue">
          <Ticket className="w-6 h-6" />
          <span className="text-xs mt-1">Events</span>
        </button>
        <button 
          className="flex flex-col items-center -mt-8"
          onClick={handleCreatePost}
        >
          <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
            <PlusSquare className="w-7 h-7 text-white" />
          </div>
        </button>
        <button className="flex flex-col items-center text-motorsport-blue">
          <Search className="w-6 h-6" />
          <span className="text-xs mt-1">Search</span>
        </button>
        <Link 
          to="/profile" 
          className={`flex flex-col items-center ${location.pathname === '/profile' ? 'text-motorsport-blue' : 'text-motorsport-blue'}`}
        >
          <User className="w-6 h-6" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default FooterNav;
