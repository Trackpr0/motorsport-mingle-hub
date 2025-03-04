
import { useState } from "react";
import { Bell, MessageSquare, Settings } from "lucide-react";
import { toast } from "sonner";

const ProfileHeader = () => {
  const handleSettingsClick = () => {
    toast.info("Settings clicked");
    // Navigate to settings page when implemented
    // navigate("/settings");
  };

  const handleMessagesClick = () => {
    toast.info("Messages clicked");
    // Navigate to messages page when implemented
    // navigate("/messages");
  };

  const handleNotificationsClick = () => {
    toast.info("Notifications clicked");
    // Navigate to notifications page when implemented
    // navigate("/notifications");
  };

  return (
    <div className="sticky top-0 z-10 bg-white p-4 shadow-sm">
      <div className="max-w-md mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">Profile</h1>
        <div className="flex items-center gap-4">
          <button className="relative" onClick={handleNotificationsClick}>
            <Bell className="w-6 h-6 text-gray-700" />
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              2
            </span>
          </button>
          <button className="relative" onClick={handleMessagesClick}>
            <MessageSquare className="w-6 h-6 text-gray-700" />
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              5
            </span>
          </button>
          <button onClick={handleSettingsClick}>
            <Settings className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
