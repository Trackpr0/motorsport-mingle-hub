import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
      {/* Logo and Title Container - Vertically centered */}
      <div className="w-full max-w-md flex-1 flex items-center justify-center">
        <div className="space-y-2 text-center">
          <img
            src="/lovable-uploads/5eac19a8-d91f-4497-a006-e116ef673259.png"
            alt="TrackHub Logo"
            className="w-[240px] h-[240px] mx-auto animate-fade-in object-contain"
          />
          <h1 className="text-4xl font-bold text-white tracking-wider animate-fade-in">
            TrackHub
          </h1>
        </div>
      </div>

      {/* Buttons Container - Positioned towards bottom */}
      <div className="w-full max-w-md space-y-4 px-6 mb-20 animate-fade-in">
        <Button
          onClick={() => navigate("/enthusiast-login")}
          className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 transform hover:scale-105"
        >
          Motorsport Enthusiast
        </Button>
        <Button
          onClick={() => navigate("/business-login")}
          className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 transform hover:scale-105"
        >
          Motorsport Business
        </Button>
      </div>
    </div>
  );
};

export default Login;