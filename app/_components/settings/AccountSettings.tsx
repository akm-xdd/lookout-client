// app/_components/settings/AccountSettings.tsx
import React from "react";
import { User, Globe, Trash2 } from "lucide-react";

const AccountSettings: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <User className="w-6 h-6 text-green-400" />
        <h2 className="text-2xl font-bold">Account Settings</h2>
        <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
          Coming Soon
        </span>
      </div>

      <p className="text-gray-400">
        Manage your profile, preferences, and account settings.
      </p>

      {/* Coming Soon Sections */}
      <div className="space-y-6">
        {/* Profile Section */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 opacity-75">
          <div className="flex items-center space-x-3 mb-4">
            <User className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold">Profile Information</h3>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Update your name, email, and profile picture.
          </p>
          <div className="space-y-2 text-sm text-gray-400">
            <div>• Change display name</div>
            <div>• Update profile picture</div>
            <div>• Manage email preferences</div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 opacity-75">
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold">Preferences</h3>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Customize your dashboard experience and regional settings.
          </p>
          <div className="space-y-2 text-sm text-gray-400">
            <div>• Timezone settings</div>
            <div>• Date format preferences</div>
            <div>• Dashboard defaults</div>
            <div>• Language selection</div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 opacity-75">
          <div className="flex items-center space-x-3 mb-4">
            <Trash2 className="w-5 h-5 text-red-400" />
            <h3 className="text-lg font-semibold text-red-400">Danger Zone</h3>
          </div>
          <p className="text-red-300 text-sm mb-4">
            Irreversible actions that affect your account and data.
          </p>
          <div className="space-y-2 text-sm text-red-300">
            <div>• Export all data</div>
            <div>• Delete account permanently</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;