"use client";
import React from "react";
import { motion } from "motion/react";
import { Settings, LogOut, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import ProtectedRoute from "../auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import AnimatedBackground from "@/app/_components/layout/AnimatedBackground";
import OverviewStatsSection from "../_components/dashboard/OverviewStatsSection";
import ChartsSection from "../_components/dashboard/ChartsSection";
import WorkspacesSection from "../_components/dashboard/WorkspacesSection";

// NEW: Single comprehensive dashboard hook
import { useDashboard } from "@/hooks/useDashboard";

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  
  // SIMPLIFIED: Single hook provides all dashboard data
  const { 
    data: dashboardData, 
    isLoading: loading, 
    error,
    refetch,
    isFetching // ADD: Track if currently fetching (for refresh button)
  } = useDashboard()

  // OAuth success handling
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("success") === "oauth") {
      window.history.replaceState({}, "", window.location.pathname);
      toast.success("Welcome back!");
    }
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleSettings = () => {
    toast.info("Settings coming soon!", {
      description: "User settings page is being built",
      duration: 3000,
    });
  };

  // Manual refresh with toast feedback and loading state
  const handleRefresh = async () => {
    const refreshPromise = refetch()
    
    toast.promise(refreshPromise, {
      loading: 'Refreshing dashboard...',
      success: 'Dashboard updated!',
      error: 'Failed to refresh dashboard'
    })
  }

  // Error state
  if (error && !loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-black text-white">
          <AnimatedBackground particleCount={20} />

          <main className="relative z-10 px-6 py-20">
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <div className="text-6xl mb-4">⚠️</div>
                <h1 className="text-3xl font-bold mb-4">
                  Unable to Load Dashboard
                </h1>
                <p className="text-gray-400 text-lg mb-8">
                  {error instanceof Error ? error.message : "Something went wrong while loading your dashboard data."}
                </p>
                
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleRefresh}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </button>
                  
                  <button
                    onClick={handleSignOut}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  // Loading state
  if (loading || !dashboardData) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
          <AnimatedBackground particleCount={50} />
          <div className="relative z-10 container mx-auto px-6 py-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Loading dashboard...</p>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white">
        <AnimatedBackground particleCount={50} />

        {/* Header */}
        <header className="relative z-10 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.div
                  className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  LookOut
                </motion.div>
                
                <motion.div
                  className="text-sm text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {user?.email}
                </motion.div>
              </div>

              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={handleRefresh}
                  className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || isFetching} // FIXED: Disable when loading or fetching
                  whileHover={{ scale: loading || isFetching ? 1 : 1.05 }} // FIXED: No hover effect when disabled
                  whileTap={{ scale: loading || isFetching ? 1 : 0.95 }} // FIXED: No tap effect when disabled
                  title="Refresh dashboard"
                >
                  <RefreshCw className={`w-5 h-5 ${(loading || isFetching) ? 'animate-spin' : ''}`} /> {/* FIXED: Spin when fetching */}
                </motion.button>

                <motion.button
                  onClick={handleSettings}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Settings"
                >
                  <Settings className="w-5 h-5" />
                </motion.button>

                <motion.button
                  onClick={handleSignOut}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Welcome Header */}
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back! 👋
              </h1>
              <p className="text-gray-400">
                Here's how your endpoints have been performing recently.
              </p>
            </div>

            {/* Overview Stats */}
            <OverviewStatsSection data={dashboardData} loading={false} />

            {/* Charts Section with ALL new data */}
            <ChartsSection data={dashboardData} loading={false} />

            {/* Workspaces Section */}
            <WorkspacesSection data={dashboardData} loading={false} />
          </motion.div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
