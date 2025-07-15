"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Settings, LogOut } from "lucide-react";
import { toast } from "sonner";
import ProtectedRoute from "../auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import AnimatedBackground from "../_components/layout/AnimatedBackground";
import OverviewStatsSection from "../_components/dashboard/OverviewStatsSection";
import ChartsSection from "../_components/dashboard/ChartsSection";
import WorkspacesSection from "../_components/dashboard/WorkspacesSection";
import { loadDashboardData, DashboardData } from "@/lib/data-loader";

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("success") === "oauth") {
      toast.success("Welcome back!");
      // Clean up URL
      window.history.replaceState({}, "", "/dashboard");
    }
  }, []);

  // Load dashboard data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await loadDashboardData();

        // If we have sample data, merge user email from auth
        if (data && user?.email) {
          data.user.email = user.email;
        }

        setDashboardData(data);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        toast.error("Failed to load dashboard", {
          description: "Please refresh the page to try again",
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleSettings = () => {
    toast.info("Settings coming soon!", {
      description: "User settings page is being built",
      duration: 3000,
    });
  };

  return (
    <ProtectedRoute>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen bg-black text-white"
      >
        <AnimatedBackground particleCount={20} />

        {/* Header */}
        <header className="relative z-10 px-6 py-4 border-b border-white/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/icon.png" alt="LookOut" className="w-8 h-8" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                LookOut
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">{user?.email}</span>
              <button
                onClick={handleSettings}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 px-6 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {loading
                  ? "Loading..."
                  : dashboardData?.workspaces.length === 0
                  ? "Welcome to LookOut"
                  : "Your Dashboard"}
              </h1>
              <p className="text-gray-400 text-lg">
                {loading
                  ? "Fetching your monitoring data..."
                  : dashboardData?.workspaces.length === 0
                  ? "Start monitoring your projects and keep them alive."
                  : "Monitor your projects and keep them running smoothly."}
              </p>
            </div>

            {/* Overview Stats */}
            {dashboardData && (
              <OverviewStatsSection data={dashboardData} loading={loading} />
            )}

            {/* Charts Section - Only show if there's data */}
            {dashboardData && (
              <ChartsSection data={dashboardData} loading={loading} />
            )}

            {/* Workspaces Section */}
            {dashboardData && (
              <WorkspacesSection data={dashboardData} loading={loading} />
            )}
          </div>
        </main>
      </motion.div>
    </ProtectedRoute>
  );
}
