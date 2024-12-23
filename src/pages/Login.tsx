import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
      <div className="w-full max-w-md space-y-8 p-6 text-center">
        {/* Logo and Title */}
        <div className="space-y-4">
          <img
            src="/lovable-uploads/86311dd6-2fee-41de-ac19-a6040da2e03e.png"
            alt="Track Hub Logo"
            className="w-32 h-32 mx-auto animate-fade-in"
          />
          <h1 className="text-4xl font-bold text-white tracking-wider animate-fade-in">
            TRACK HUB
          </h1>
        </div>

        {/* Account Type Selection */}
        <div className="space-y-4 mt-12 animate-fade-in">
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