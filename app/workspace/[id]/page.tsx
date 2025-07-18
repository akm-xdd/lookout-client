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

// NEW: Import hooks instead of manual data loading
import { useWorkspace, useWorkspaceEndpoints } from "@/hooks/useWorkspace";
import { useUpdateWorkspace, useDeleteWorkspace } from "@/hooks/useWorkspaces";

// Import your existing transform function
import { EndpointData } from "@/lib/data-loader";

// Transform function (keeping your existing logic)
function transformEndpointData(endpoint: any): EndpointData {
  return {
    id: endpoint.id,
    name: endpoint.name,
    url: endpoint.url,
    method: endpoint.method,
    status: endpoint.is_active ? "unknown" : "offline",
    uptime: null,
    responseTime: null,
    lastCheck: null,
    frequency: endpoint.frequency_minutes,
  };
}

function transformWorkspaceData(workspaceData: any, endpointsData: any[]) {
  // Keep the raw endpoints data instead of transforming it
  const rawEndpoints = endpointsData || [];

  // Calculate workspace stats from raw data (for existing logic)
  const transformedEndpoints: EndpointData[] = rawEndpoints.map(
    transformEndpointData
  );

  // Calculate workspace stats
  const onlineEndpoints = transformedEndpoints.filter(
    (e) => e.status === "online"
  ).length;
  const warningEndpoints = transformedEndpoints.filter(
    (e) => e.status === "warning"
  ).length;
  const offlineEndpoints = transformedEndpoints.filter(
    (e) => e.status === "offline"
  ).length;

  // Determine workspace status
  let workspaceStatus: "online" | "warning" | "offline" | "unknown" = "unknown";
  if (transformedEndpoints.length === 0) {
    workspaceStatus = "unknown";
  } else if (offlineEndpoints > 0) {
    workspaceStatus = "offline";
  } else if (warningEndpoints > 0) {
    workspaceStatus = "warning";
  } else if (onlineEndpoints > 0) {
    workspaceStatus = "online";
  } else {
    workspaceStatus = "unknown";
  }

  // Calculate averages
  const uptimeValues = transformedEndpoints
    .filter((e) => e.uptime !== null)
    .map((e) => e.uptime!);
  const avgUptime =
    uptimeValues.length > 0
      ? uptimeValues.reduce((sum, uptime) => sum + uptime, 0) /
        uptimeValues.length
      : null;

  const responseTimeValues = transformedEndpoints
    .filter((e) => e.responseTime !== null)
    .map((e) => e.responseTime!);
  const avgResponseTime =
    responseTimeValues.length > 0
      ? responseTimeValues.reduce((sum, time) => sum + time, 0) /
        responseTimeValues.length
      : null;

  const checkTimes = transformedEndpoints
    .filter((e) => e.lastCheck !== null)
    .map((e) => e.lastCheck!);
  const lastCheck =
    checkTimes.length > 0
      ? checkTimes.reduce((latest, current) =>
          new Date(current) > new Date(latest) ? current : latest
        )
      : null;

  return {
    ...workspaceData,
    endpointCount: transformedEndpoints.length,
    maxEndpoints: 7,
    status: workspaceStatus,
    uptime: avgUptime,
    avgResponseTime: avgResponseTime,
    lastCheck: lastCheck,
    activeIncidents: offlineEndpoints,
    endpoints: transformedEndpoints, // Keep this for WorkspaceChartsSection
    rawEndpoints: rawEndpoints, // Add this for EndpointsTable
  };
}

export default function WorkspaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.id as string;

  // REPLACE: All manual data loading with these hooks
  const {
    data: workspaceData,
    isLoading: workspaceLoading,
    error: workspaceError,
    refetch: refetchWorkspace,
  } = useWorkspace(workspaceId);

  const {
    data: endpointsData,
    isLoading: endpointsLoading,
    error: endpointsError,
    refetch: refetchEndpoints,
  } = useWorkspaceEndpoints(workspaceId);

  // DERIVED STATE: Combine workspace and endpoints data
  const workspace = React.useMemo(() => {
    if (!workspaceData || !endpointsData) return null;
    return transformWorkspaceData(workspaceData, endpointsData);
  }, [workspaceData, endpointsData]);

  const loading = workspaceLoading || endpointsLoading;
  const error = workspaceError || endpointsError;

  // Modal states stay the same
  const [addEndpointModalOpen, setAddEndpointModalOpen] = useState(false);
  const [editWorkspaceModalOpen, setEditWorkspaceModalOpen] = useState(false);
  const [deleteWorkspaceModalOpen, setDeleteWorkspaceModalOpen] =
    useState(false);

  // SIMPLIFIED: Manual refresh
  const handleManualRefresh = async () => {
    console.log("🔄 Manual workspace refresh triggered");
    await Promise.all([refetchWorkspace(), refetchEndpoints()]);
    toast.success("Workspace refreshed");
  };

  // Handler functions for workspace actions
  const handleEditWorkspace = () => {
    setEditWorkspaceModalOpen(true);
  };

  const handleDeleteWorkspace = () => {
    setDeleteWorkspaceModalOpen(true);
  };

  // SIMPLIFIED: Success handlers - no manual refresh needed
  const handleWorkspaceEdited = () => {
    setEditWorkspaceModalOpen(false);
    // No manual refresh - mutation handles cache invalidation
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
    // No manual refresh - mutation handles cache invalidation
  };

  const handleEndpointDeleted = () => {
    // No manual refresh - mutation handles cache invalidation
  };

  if (loading) {
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

  if (error) {
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
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Try Again
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

  if (!workspace) {
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
            {/* Workspace Header */}
            <WorkspaceHeader
              workspace={{
                ...workspace,
                createdAt: workspace.created_at,
              }}
              onRefresh={handleManualRefresh}
              onAddEndpoint={handleAddEndpoint}
              onEditWorkspace={handleEditWorkspace}
              onDeleteWorkspace={handleDeleteWorkspace}
            />

            {/* Main Content */}
            <div className="space-y-8">
              {/* Endpoints Table - REMOVE callback props */}
              <EndpointsTable
                endpoints={workspace.rawEndpoints} // Changed from workspace.endpoints
                workspaceId={workspaceId}
                onEndpointDeleted={handleEndpointDeleted}
                onAddEndpoint={handleAddEndpoint}
              />

              {/* Charts Section */}
              <WorkspaceChartsSection workspaceData={workspace} />
            </div>
          </motion.div>
        </div>

        {/* Add Endpoint Modal */}
        <EndpointFormModal
          workspaceId={workspaceId}
          maxEndpoints={workspace.maxEndpoints}
          currentEndpoints={workspace.endpointCount}
          isOpen={addEndpointModalOpen}
          onClose={() => setAddEndpointModalOpen(false)}
          onSuccess={handleEndpointAdded}
        />

        {/* Edit Workspace Modal */}
        <EditWorkspaceModal
          isOpen={editWorkspaceModalOpen}
          onClose={() => setEditWorkspaceModalOpen(false)}
          onSuccess={handleWorkspaceEdited}
          workspace={
            workspace
              ? {
                  id: workspace.id,
                  name: workspace.name,
                  description: workspace.description,
                }
              : null
          }
        />

        {/* Delete Workspace Modal */}
        <DeleteWorkspaceModal
          isOpen={deleteWorkspaceModalOpen}
          onClose={() => setDeleteWorkspaceModalOpen(false)}
          onSuccess={handleWorkspaceDeleted}
          workspace={
            workspace
              ? {
                  id: workspace.id,
                  name: workspace.name,
                  description: workspace.description,
                  endpointCount: workspace.endpointCount,
                }
              : null
          }
        />
      </div>
    </ProtectedRoute>
  );
}
