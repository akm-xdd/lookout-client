"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "motion/react";
import { Settings, LogOut, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import ProtectedRoute from "../auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import AnimatedBackground from "@/app/_components/layout/AnimatedBackground";
import OverviewStatsSection from "../_components/dashboard/OverviewStatsSection";
import ChartsSection from "../_components/dashboard/ChartsSection";
import WorkspacesSection from "../_components/dashboard/WorkspacesSection";
import { loadDashboardData, DashboardData } from "@/lib/data-loader";
import { loadDashboardDataCached, refreshDashboardData } from "@/lib/cached-data-loader";
import { cacheInvalidation } from "@/lib/data-loader";
export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // if route is dashboard?success=true, show success toast
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("success") === "oauth") {
      // reset search params to avoid showing toast again
      window.history.replaceState({}, "", window.location.pathname);
      toast.success("Welcome back!");
    }
  }, []);

  // Track if data has been loaded to prevent unnecessary refetches
  const hasLoadedData = useRef(false);

  // Load data function - keep user dependency but use user.id to prevent recreations
const loadData = useCallback(async () => {
  if (!user) return;

  try {
    setLoading(true);
    setError(null);
    console.log("🔄 Loading dashboard data...");

    // Use cached version instead of direct API call
    const dashData = await loadDashboardDataCached();

    console.log("Dashboard data:", dashData);
    console.log("Workspaces:", dashData?.workspaces);
    console.log("Overview:", dashData?.overview);

    // Merge user email from auth
    if (dashData && user?.email) {
      dashData.user.email = user.email;
      dashData.user.id = user.id;
    }

    setDashboardData(dashData);
    hasLoadedData.current = true;
  } catch (loadError) {
    console.error("Failed to load dashboard data:", loadError);
    const errorMessage =
      loadError instanceof Error ? loadError.message : "Unknown error";
    setError(errorMessage);

    toast.error("Failed to load dashboard", {
      description: errorMessage,
      duration: 5000,
    });
  } finally {
    setLoading(false);
  }
}, [user?.id, user?.email]);
  // Load data only once when user becomes available
  useEffect(() => {
    if (user && !hasLoadedData.current) {
      loadData();
    }
  }, [user, loadData]);

  // Handle data refresh (for when workspaces are created/updated)
const handleDataRefresh = useCallback(async () => {
  if (!user) return;
  
  console.log("🔄 Manual refresh triggered");
  
  try {
    setLoading(true);
    // Force refresh by clearing cache first
    const dashData = await refreshDashboardData();
    
    // Merge user email from auth
    if (dashData && user?.email) {
      dashData.user.email = user.email;
      dashData.user.id = user.id;
    }

    setDashboardData(dashData);
    toast.success("Dashboard refreshed");
  } catch (error) {
    console.error("Refresh failed:", error);
    toast.error("Failed to refresh dashboard");
  } finally {
    setLoading(false);
  }
}, [user?.id, user?.email]);

// ADD THIS FUNCTION TO HANDLE WORKSPACE CHANGES:
const handleWorkspaceChange = useCallback(() => {
  // Invalidate cache when workspaces are modified
  cacheInvalidation.onWorkspaceChange();
  // Reload data
  loadData();
}, [loadData]);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleSettings = () => {
    toast.info("Settings coming soon!", {
      description: "User settings page is being built",
      duration: 3000,
    });
  };

  const handleRetry = () => {
    hasLoadedData.current = false; // Reset the flag to allow retry
    loadData();
  };

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
                <p className="text-gray-400 text-lg mb-8">{error}</p>
                <div className="space-y-4">
                  <button
                    onClick={handleRetry}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all mx-auto"
                  >
                    <RefreshCw className="w-5 h-5" />
                    <span>Retry</span>
                  </button>
                  <p className="text-gray-500 text-sm">
                    Make sure your FastAPI server is running on port 8000
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

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
                onClick={handleDataRefresh}
                disabled={loading}
                className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw
                  className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                />
              </button>
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
                  ? "Create your first workspace to start monitoring your projects."
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
              <WorkspacesSection
                data={dashboardData}
                loading={loading}
                onRefresh={handleDataRefresh}
              />
            )}
          </div>
        </main>
      </motion.div>
    </ProtectedRoute>
  );
}
