import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
      <div className="w-full max-w-md space-y-8 p-6 text-center flex flex-col min-h-screen">
        {/* Logo and Title */}
        <div className="space-y-0 mt-12">
          <img
            src="/lovable-uploads/5eac19a8-d91f-4497-a006-e116ef673259.png"
            alt="TrackHub Logo"
            className="w-[480px] h-[480px] mx-auto animate-fade-in object-contain"
          />
          <h1 className="text-4xl font-bold text-white tracking-wider animate-fade-in -mt-8">
            TrackHub
          </h1>
        </div>

        {/* Account Type Selection */}
        <div className="space-y-4 mt-auto mb-16 animate-fade-in">
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
    </div>
  );
};

export default Login;