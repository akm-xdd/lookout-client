// app/settings/page.tsx
"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import ProtectedRoute from "@/app/auth/ProtectedRoute";
import AnimatedBackground from "@/app/_components/layout/AnimatedBackground";
import SettingsHeader from "../_components/settings/SettingsHeader";
import SettingsSidebar from "../_components/settings/SettingsSidebar";
import NotificationSettings from "../_components/settings/NotificationSettings";
import IntegrationsSettings from "../_components/settings/IntegrationsSettings";

type SettingsTab = 'notifications' | 'integrations' | 'account' | 'api';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('notifications');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'notifications':
        return <NotificationSettings />;
      case 'integrations':
        return <IntegrationsSettings />;
      default:
        return <NotificationSettings />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white">
        <AnimatedBackground particleCount={30} />

        <div className="relative z-10">
          {/* Header */}
          <SettingsHeader />

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <SettingsSidebar 
                  activeTab={activeTab} 
                  onTabChange={setActiveTab} 
                />
              </div>

              {/* Content */}
              <div className="lg:col-span-3">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
                >
                  {renderActiveTab()}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}