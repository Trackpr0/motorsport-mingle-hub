
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import EnthusiastLogin from "./pages/EnthusiastLogin";
import BusinessLogin from "./pages/BusinessLogin";
import CreateProfile from "./pages/CreateProfile";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-white">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/home" element={<Index />} />
              <Route path="/enthusiast-login" element={<EnthusiastLogin />} />
              <Route path="/business-login" element={<BusinessLogin />} />
              <Route path="/create-profile" element={<CreateProfile />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Login />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
