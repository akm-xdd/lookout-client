// @ts-nocheck

"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import ProtectedRoute from "@/app/auth/ProtectedRoute";
import AnimatedBackground from "@/app/_components/layout/AnimatedBackground";
import WorkspaceHeader from "@/app/_components/workspace/WorkspaceHeader";
import EndpointsTable from "@/app/_components/workspace/EndpointsTable";
import WorkspaceChartsSection from "@/app/_components/workspace/WorkspaceChartsSection";
import EndpointFormModal from "@/app/_components/workspace/EndpointFormModal";
import EditWorkspaceModal from "@/app/_components/workspace/EditWorkspaceModal";
import DeleteWorkspaceModal from "@/app/_components/workspace/DeleteWorkspaceModal";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

// NEW: Import unified hook and transformers
import { useWorkspaceStats, useRefreshWorkspaceStats } from "@/hooks/useWorkspaceMetrics";
import { 
  transformForWorkspaceHeader,
  transformForWorkspaceCharts,
  transformForEndpointsTable,
  transformForMonitoringCharts,
  transformForHealthSummary,
  getDataFreshnessText
} from "@/lib/workspace-transformers";

export default function WorkspaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.id as string;

  // NEW: Single unified data source replacing 3+ separate hooks
  const {
    data: workspaceStats,
    isLoading,
    isError,
    error,
    isFetching,
  } = useWorkspaceStats(workspaceId);

  // NEW: Manual refresh with optimistic loading
  const { refresh, isRefreshing } = useRefreshWorkspaceStats(workspaceId);

  // Modal states
  const [addEndpointModalOpen, setAddEndpointModalOpen] = useState(false);
  const [editWorkspaceModalOpen, setEditWorkspaceModalOpen] = useState(false);
  const [deleteWorkspaceModalOpen, setDeleteWorkspaceModalOpen] = useState(false);

  // NEW: Enhanced refresh handler with better UX
  const handleManualRefresh = async () => {
    console.log("🔄 Manual workspace refresh triggered");
    try {
      await refresh();
      toast.success(`Workspace refreshed • ${getDataFreshnessText(workspaceStats?.generated_at || '')}`);
    } catch (error) {
      console.error('Refresh error:', error);
      toast.error("Failed to refresh workspace");
    }
  };

  // Handler functions for workspace actions
  const handleEditWorkspace = () => {
    setEditWorkspaceModalOpen(true);
  };

  const handleDeleteWorkspace = () => {
    setDeleteWorkspaceModalOpen(true);
  };

  const handleWorkspaceEdited = () => {
    setEditWorkspaceModalOpen(false);
    // Note: React Query will automatically refetch and update the UI
  };

  const handleWorkspaceDeleted = () => {
    setDeleteWorkspaceModalOpen(false);
    toast.success("Workspace deleted successfully!");
    router.push("/dashboard");
  };

  const handleAddEndpoint = () => {
    setAddEndpointModalOpen(true);
  };

  const handleEndpointAdded = () => {
    setAddEndpointModalOpen(false);
    // Note: React Query will automatically refetch and update the UI
  };

  const handleEndpointDeleted = () => {
    // Note: React Query mutation handles cache invalidation automatically
  };

  // Loading state
  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-900 relative overflow-hidden">
          <AnimatedBackground />
          <div className="relative z-10 container mx-auto px-6 py-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Loading workspace...</p>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Error state
  if (isError) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-900 relative overflow-hidden">
          <AnimatedBackground />
          <div className="relative z-10 container mx-auto px-6 py-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="text-6xl mb-4">😞</div>
                <h2 className="text-2xl font-bold text-white mb-2">Oops!</h2>
                <p className="text-gray-400 mb-6">
                  {error instanceof Error
                    ? error.message
                    : "Failed to load workspace"}
                </p>
                <div className="space-y-4">
                  <button
                    onClick={handleManualRefresh}
                    disabled={isRefreshing}
                    className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span>{isRefreshing ? 'Retrying...' : 'Try Again'}</span>
                  </button>
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="block mx-auto text-gray-400 hover:text-white transition-colors"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // No data state (shouldn't happen with proper error handling)
  if (!workspaceStats) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-900 relative overflow-hidden">
          <AnimatedBackground />
          <div className="relative z-10 container mx-auto px-6 py-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="text-6xl mb-4">🤷‍♂️</div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Workspace Not Found
                </h2>
                <p className="text-gray-400 mb-6">
                  The workspace you're looking for doesn't exist.
                </p>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // NEW: Transform unified data for each component
  const workspaceHeaderData = transformForWorkspaceHeader(workspaceStats);
  const workspaceChartsData = transformForWorkspaceCharts(workspaceStats);
  const endpointsTableData = transformForEndpointsTable(workspaceStats);
  const monitoringChartsData = transformForMonitoringCharts(workspaceStats);
  const healthSummaryData = transformForHealthSummary(workspaceStats);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 relative overflow-hidden">
        <AnimatedBackground />

        <div className="relative z-10 container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >

            {/* Workspace Header - NOW USES UNIFIED DATA */}
            <WorkspaceHeader
              workspace={workspaceHeaderData}
              onRefresh={handleManualRefresh}
              onAddEndpoint={handleAddEndpoint}
              onEditWorkspace={handleEditWorkspace}
              onDeleteWorkspace={handleDeleteWorkspace}
            />

            {/* Main Content */}
            <div className="space-y-8">
              {/* Endpoints Table - NOW USES UNIFIED DATA */}
              <EndpointsTable
                endpoints={endpointsTableData}
                workspaceId={workspaceId}
                onEndpointDeleted={handleEndpointDeleted}
                onAddEndpoint={handleAddEndpoint}
              />

              {/* Charts Section - NOW USES UNIFIED DATA WITH CALCULATED STATS AND INCIDENTS */}
              <WorkspaceChartsSection 
                workspaceData={workspaceChartsData}
                endpointStats={monitoringChartsData}
                healthStats={healthSummaryData}
                recentIncidents={workspaceStats.recent_incidents} // ADD THIS
              />
            </div>
          </motion.div>
        </div>

        {/* Modals - Use workspace data from unified source */}
        <EndpointFormModal
          workspaceId={workspaceId}
          maxTotalEndpoints={7} // TODO: Get from user limits
          currentEndpoints={workspaceStats.overview.totalEndpoints}
          isOpen={addEndpointModalOpen}
          onClose={() => setAddEndpointModalOpen(false)}
          onSuccess={handleEndpointAdded}
        />

        <EditWorkspaceModal
          isOpen={editWorkspaceModalOpen}
          onClose={() => setEditWorkspaceModalOpen(false)}
          onSuccess={handleWorkspaceEdited}
          workspace={{
            id: workspaceStats.workspace.id,
            name: workspaceStats.workspace.name,
            description: workspaceStats.workspace.description,
          }}
        />

        <DeleteWorkspaceModal
          isOpen={deleteWorkspaceModalOpen}
          onClose={() => setDeleteWorkspaceModalOpen(false)}
          onSuccess={handleWorkspaceDeleted}
          workspace={{
            id: workspaceStats.workspace.id,
            name: workspaceStats.workspace.name,
            description: workspaceStats.workspace.description,
            endpointCount: workspaceStats.overview.totalEndpoints,
          }}
        />
      </div>
    </ProtectedRoute>
  );
}