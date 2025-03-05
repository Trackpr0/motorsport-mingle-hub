
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import EnthusiastLogin from "./pages/EnthusiastLogin";
import BusinessLogin from "./pages/BusinessLogin";
import CreateProfile from "./pages/CreateProfile";
import Profile from "./pages/Profile";
import CreateBusinessProfile from "./pages/CreateBusinessProfile";
import CreatePost from "./pages/CreatePost";
import PostDetails from "./pages/PostDetails";
import CreateEvent from "@/pages/CreateEvent";
import EventDetails from "@/pages/EventDetails";
import ManageMemberships from "./pages/ManageMemberships";
import MembershipMembers from "./pages/MembershipMembers";
import BrowseMemberships from "./pages/BrowseMemberships";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-white">
          <Toaster />
          <Sonner />
          <Router>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/home" element={<Index />} />
              <Route path="/enthusiast-login" element={<EnthusiastLogin />} />
              <Route path="/business-login" element={<BusinessLogin />} />
              <Route path="/create-profile" element={<CreateProfile />} />
              <Route path="/create-business-profile" element={<CreateBusinessProfile />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/post-details" element={<PostDetails />} />
              <Route path="/create-event" element={<CreateEvent />} />
              <Route path="/event-details" element={<EventDetails />} />
              <Route path="/manage-memberships" element={<ManageMemberships />} />
              <Route path="/membership/:membershipId/members" element={<MembershipMembers />} />
              <Route path="/memberships" element={<BrowseMemberships />} />
              <Route path="*" element={<Login />} />
            </Routes>
          </Router>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
