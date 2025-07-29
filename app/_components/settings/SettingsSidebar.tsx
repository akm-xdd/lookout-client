// app/_components/settings/SettingsSidebar.tsx
import React from "react";
import { motion } from "motion/react";
import { 
  Bell, 
  Webhook, 
  User, 
  Key,
  ChevronRight
} from "lucide-react";

type SettingsTab = 'notifications' | 'integrations' | 'account' | 'api';

interface SettingsSidebarProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

interface TabItem {
  id: SettingsTab;
  label: string;
  icon: React.ReactNode;
  description: string;
  comingSoon?: boolean;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ 
  activeTab, 
  onTabChange 
}) => {
  const tabs: TabItem[] = [
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
      description: 'Email alerts and notification preferences'
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: <Webhook className="w-5 h-5" />,
      description: 'Webhooks, Slack, Discord, and more',
      comingSoon: true
    },
    {
      id: 'account',
      label: 'Account',
      icon: <User className="w-5 h-5" />,
      description: 'Profile, preferences, and personal settings',
      comingSoon: true
    },
    {
      id: 'api',
      label: 'API & Security',
      icon: <Key className="w-5 h-5" />,
      description: 'API keys, tokens, and security settings',
      comingSoon: true
    }
  ];

  return (
    <div className="space-y-2">
      <motion.h2 
        className="text-lg font-semibold mb-4 text-gray-300"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Categories
      </motion.h2>

      {tabs.map((tab, index) => (
        <motion.button
          key={tab.id}
          onClick={() => !tab.comingSoon && onTabChange(tab.id)}
          disabled={tab.comingSoon}
          className={`
            w-full text-left p-4 rounded-lg transition-all duration-200 group
            ${activeTab === tab.id 
              ? 'bg-blue-500/20 border border-blue-500/50 text-white' 
              : tab.comingSoon
                ? 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed'
                : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
            }
          `}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={tab.comingSoon ? {} : { scale: 1.02 }}
          whileTap={tab.comingSoon ? {} : { scale: 0.98 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`
                ${activeTab === tab.id 
                  ? 'text-blue-400' 
                  : tab.comingSoon 
                    ? 'text-gray-600' 
                    : 'text-gray-400 group-hover:text-white'
                }
              `}>
                {tab.icon}
              </div>
              <div>
                <div className="font-medium flex items-center space-x-2">
                  <span>{tab.label}</span>
                  {tab.comingSoon && (
                    <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded-full">
                      Soon
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {tab.description}
                </div>
              </div>
            </div>
            
            {!tab.comingSoon && (
              <ChevronRight className={`
                w-4 h-4 transition-all duration-200
                ${activeTab === tab.id 
                  ? 'text-blue-400 rotate-90' 
                  : 'text-gray-500 group-hover:text-gray-300'
                }
              `} />
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default SettingsSidebar;