"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query"; // ADD THIS
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
import { workspaceAPI } from '@/lib/api-client'

// NEW: Import hooks instead of manual data loading
import { useWorkspace, useWorkspaceEndpoints } from "@/hooks/useWorkspace";
import { useUpdateWorkspace, useDeleteWorkspace } from "@/hooks/useWorkspaces";

// Import your existing transform function
import { EndpointData } from "@/lib/data-loader";

// NEW: Add monitoring stats hook
const useWorkspaceMonitoring = (workspaceId: string) => {
  return useQuery({
    queryKey: ['workspace-monitoring', workspaceId],
    queryFn: () => workspaceAPI.getWorkspaceMonitoring(workspaceId),
    refetchInterval: 30000,
    enabled: !!workspaceId
  });
};

// Transform function (updated with real monitoring data)
function transformEndpointData(endpoint: any, monitoringStats: any[]): EndpointData {
  const stat = monitoringStats.find(s => s.id === endpoint.id);
  
  // Determine real status based on monitoring data
  let status: "online" | "warning" | "offline" | "unknown" = "unknown";
  if (!endpoint.is_active) {
    status = "offline";
  } else if (stat?.last_check_success === true) {
    status = "online";
  } else if (stat?.last_check_success === false) {
    status = (stat?.consecutive_failures || 0) >= 3 ? "offline" : "warning";
  }

  // Calculate uptime percentage
  let uptime: number | null = null;
  if (stat?.checks_last_24h > 0) {
    uptime = (stat.successful_checks_24h / stat.checks_last_24h) * 100;
  }

  return {
    id: endpoint.id,
    name: endpoint.name,
    url: endpoint.url,
    method: endpoint.method,
    status,
    uptime,
    responseTime: stat?.last_response_time || null,
    lastCheck: stat?.last_check_at || null,
    frequency: endpoint.frequency_minutes,
  };
}

function transformWorkspaceData(workspaceData: any, endpointsData: any[], monitoringStats: any[]) {
  // Keep the raw endpoints data instead of transforming it
  const rawEndpoints = endpointsData || [];

  // Calculate workspace stats from raw data WITH REAL MONITORING
  const transformedEndpoints: EndpointData[] = rawEndpoints.map(
    endpoint => transformEndpointData(endpoint, monitoringStats)
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

  // Calculate averages FROM REAL DATA
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

  // EXISTING: All manual data loading with these hooks
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

  // NEW: Add monitoring data hook
  const {
    data: monitoringStats,
    isLoading: monitoringLoading,
    error: monitoringError,
    refetch: refetchMonitoring,
  } = useWorkspaceMonitoring(workspaceId);

  // UPDATED: Combine workspace, endpoints AND monitoring data
  const workspace = React.useMemo(() => {
    if (!workspaceData || !endpointsData) return null;
    return transformWorkspaceData(workspaceData, endpointsData, monitoringStats || []);
  }, [workspaceData, endpointsData, monitoringStats]);

  const loading = workspaceLoading || endpointsLoading || monitoringLoading;
  const error = workspaceError || endpointsError || monitoringError;

  // Modal states stay the same
  const [addEndpointModalOpen, setAddEndpointModalOpen] = useState(false);
  const [editWorkspaceModalOpen, setEditWorkspaceModalOpen] = useState(false);
  const [deleteWorkspaceModalOpen, setDeleteWorkspaceModalOpen] =
    useState(false);

  // UPDATED: Manual refresh includes monitoring data
  const handleManualRefresh = async () => {
    console.log("🔄 Manual workspace refresh triggered");
    await Promise.all([
      refetchWorkspace(), 
      refetchEndpoints(), 
      refetchMonitoring() // ADD THIS
    ]);
    toast.success("Workspace refreshed");
  };

  // Handler functions for workspace actions (unchanged)
  const handleEditWorkspace = () => {
    setEditWorkspaceModalOpen(true);
  };

  const handleDeleteWorkspace = () => {
    setDeleteWorkspaceModalOpen(true);
  };

  const handleWorkspaceEdited = () => {
    setEditWorkspaceModalOpen(false);
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
              {/* Endpoints Table */}
              <EndpointsTable
                endpoints={workspace.rawEndpoints}
                workspaceId={workspaceId}
                onEndpointDeleted={handleEndpointDeleted}
                onAddEndpoint={handleAddEndpoint}
              />

              {/* Charts Section - NOW WITH REAL MONITORING DATA */}
              <WorkspaceChartsSection 
                workspaceData={workspace} 
                endpointStats={monitoringStats || []}
                // timeSeriesData={timeSeriesData || []}
              />
            </div>
          </motion.div>
        </div>

        {/* Modals (unchanged) */}
        <EndpointFormModal
          workspaceId={workspaceId}
          maxEndpoints={workspace.maxEndpoints}
          currentEndpoints={workspace.endpointCount}
          isOpen={addEndpointModalOpen}
          onClose={() => setAddEndpointModalOpen(false)}
          onSuccess={handleEndpointAdded}
        />

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