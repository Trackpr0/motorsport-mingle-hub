import { Home, User, PlusSquare, Trophy } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-motorsport-blue to-motorsport-purple p-4 backdrop-blur-lg bg-opacity-90 border-t border-white/10">
      <div className="max-w-md mx-auto flex justify-around items-center">
        <NavItem icon={<Home />} path="/" isActive={isActive("/")} label="Home" />
        <NavItem icon={<Trophy />} path="/events" isActive={isActive("/events")} label="Events" />
        <NavItem icon={<PlusSquare />} path="/create" isActive={isActive("/create")} label="Post" />
        <NavItem icon={<User />} path="/profile" isActive={isActive("/profile")} label="Profile" />
      </div>
    </nav>
  );
};

const NavItem = ({ icon, path, isActive, label }: { icon: React.ReactNode; path: string; isActive: boolean; label: string }) => (
  <Link
    to={path}
    className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
      isActive ? "text-motorsport-pink scale-110" : "text-white/70 hover:text-white"
    }`}
  >
    <div className="w-6 h-6">{icon}</div>
    <span className="text-xs">{label}</span>
  </Link>
);

export default Navigation;