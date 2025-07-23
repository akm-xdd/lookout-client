import React, { useState } from "react";
import {
  ExternalLink,
  Play,
  Trash2,
  Eye,
  Clock,
  AlertCircle,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { toast } from "sonner";
import DeleteEndpointModal from "./DeleteEndpointModal";
import ViewEndpointModal from "./ViewEndpointModal";
import TestResultsModal from "./TestResultsModal";
import { useToggleEndpoint } from "@/hooks/useEndpoints";
import { useTestEndpoint } from "@/hooks/useEndpoints";

// Raw endpoint interface (from API)
interface RawEndpoint {
  id: string;
  name: string;
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: string;
  expected_status: number;
  frequency_minutes: number;
  timeout_seconds: number;
  is_active: boolean;
  created_at: string;
  workspace_id: string;
}

interface EndpointsTableProps {
  endpoints: RawEndpoint[];
  workspaceId: string;
  onEndpointDeleted: () => void;
  onAddEndpoint: () => void;
  className?: string;
}

const EndpointsTable: React.FC<EndpointsTableProps> = ({
  endpoints,
  workspaceId,
  onEndpointDeleted,
  onAddEndpoint,
  className = "",
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [endpointToDelete, setEndpointToDelete] = useState<{
    id: string;
    name: string;
    url: string;
    method: string;
  } | null>(null);
  const [endpointToView, setEndpointToView] = useState<RawEndpoint | null>(
    null
  );
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [testingEndpointId, setTestingEndpointId] = useState<string | null>(
    null
  );

  // Toggle endpoint hook
  const toggleEndpoint = useToggleEndpoint(workspaceId);
  // Test endpoint hook;
  const testEndpoint = useTestEndpoint(workspaceId);

  // Helper functions for display
  const getStatusIcon = (isActive: boolean) => {
    if (isActive) {
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    } else {
      return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (isActive: boolean) => {
    if (isActive) {
      return "text-green-400 bg-green-400/10";
    } else {
      return "text-gray-400 bg-gray-400/10";
    }
  };

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET":
        return "text-blue-400 bg-blue-400/10";
      case "POST":
        return "text-green-400 bg-green-400/10";
      case "PUT":
        return "text-yellow-400 bg-yellow-400/10";
      case "DELETE":
        return "text-red-400 bg-red-400/10";
      case "PATCH":
        return "text-purple-400 bg-purple-400/10";
      case "HEAD":
        return "text-gray-400 bg-gray-400/10";
      case "OPTIONS":
        return "text-orange-400 bg-orange-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  const formatLastCheck = (date: string | null) => {
    if (!date) return "Never";
    const diffInMinutes = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / (1000 * 60)
    );
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

const handleTestEndpoint = async (endpoint: RawEndpoint) => {
  setTestingEndpointId(endpoint.id)
  
  try {
    const result = await testEndpoint.mutateAsync(endpoint.id)
    
    // Enhance the result with missing data from endpoint
    const enhancedResult = {
      ...result,
      endpointName: endpoint.name,
      endpointId: endpoint.id,
      timeout_seconds: endpoint.timeout_seconds, // Use frontend data
      timestamp: Date.now(), // Add current timestamp in milliseconds
      response_headers: result.headers || {}, // Map headers to expected key
    }
    
    setTestResult(enhancedResult)
    setTestModalOpen(true)
  } catch (error: any) {
    toast.error('Failed to test endpoint', {
      description: error?.message || 'Unknown error',
      duration: 4000,
    })
  } finally {
    setTestingEndpointId(null)
  }
}

  const handleViewEndpoint = (endpoint: RawEndpoint) => {
    setEndpointToView(endpoint);
    setViewModalOpen(true);
  };

  const handleDeleteEndpoint = (endpoint: RawEndpoint) => {
    setEndpointToDelete({
      id: endpoint.id,
      name: endpoint.name,
      url: endpoint.url,
      method: endpoint.method,
    });
    setDeleteModalOpen(true);
  };

  const handleToggleEndpoint = async (endpoint: RawEndpoint) => {
    const newStatus = !endpoint.is_active;

    try {
      await toggleEndpoint.mutateAsync({
        endpointId: endpoint.id,
        isActive: newStatus,
      });

      toast.success(`Endpoint ${newStatus ? "activated" : "deactivated"}`, {
        description: `"${endpoint.name}" is now ${
          newStatus ? "active" : "inactive"
        }`,
        duration: 3000,
      });
    } catch (error: any) {
      toast.error("Failed to update endpoint", {
        description: error?.message || "Unknown error",
        duration: 4000,
      });
    }
  };

  const handleVisitUrl = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (endpoints.length === 0) {
    return (
      <div
        className={`bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center ${className}`}
      >
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          No Endpoints Yet
        </h3>
        <p className="text-gray-400 mb-6">
          Start monitoring by adding your first endpoint. We'll keep it awake
          and track its uptime.
        </p>
        <button
          onClick={onAddEndpoint}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Add Your First Endpoint
        </button>
      </div>
    );
  }

  return (
    <>
      <div
        className={`bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 ${className}`}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Endpoints</h2>
           {/* hide the add endpoint button if there are already 7 endpoints */}
            {endpoints.length < 7 && (
              <button
                onClick={onAddEndpoint}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Add Endpoint
              </button>
            )}
          </div>
          <p className="text-gray-400 text-sm mt-1">
            {endpoints.length} endpoint{endpoints.length !== 1 ? "s" : ""}{" "}
            configured
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-6 text-gray-400 font-medium text-sm">
                  Endpoint
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  Active
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  Frequency
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  Expected
                </th>
                <th className="text-right py-3 px-6 text-gray-400 font-medium text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map((endpoint) => (
                <tr
                  key={endpoint.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  {/* Endpoint Name & URL */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white mb-1">
                          {endpoint.name}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(
                              endpoint.method
                            )}`}
                          >
                            {endpoint.method}
                          </span>
                          <button
                            onClick={() => handleVisitUrl(endpoint.url)}
                            className="text-blue-400 hover:text-blue-300 text-xs transition-colors break-all"
                            title="Visit URL"
                          >
                            {endpoint.url.length > 40
                              ? endpoint.url.substring(0, 40) + "..."
                              : endpoint.url}
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(endpoint.is_active)}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          endpoint.is_active
                        )}`}
                      >
                        {endpoint.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>

                  {/* Toggle Active */}
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleToggleEndpoint(endpoint)}
                      disabled={toggleEndpoint.isPending}
                      className="flex items-center space-x-2 p-1 hover:bg-white/10 rounded transition-colors disabled:opacity-50"
                      title={`${
                        endpoint.is_active ? "Deactivate" : "Activate"
                      } endpoint`}
                    >
                      {endpoint.is_active ? (
                        <ToggleRight className="w-5 h-5 text-green-400" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </td>

                  {/* Frequency */}
                  <td className="py-4 px-4">
                    <span className="text-gray-300 text-sm">
                      {endpoint.frequency_minutes}m
                    </span>
                  </td>

                  {/* Expected Status */}
                  <td className="py-4 px-4">
                    <span className="text-gray-300 text-sm font-mono">
                      {endpoint.expected_status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewEndpoint(endpoint)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => handleTestEndpoint(endpoint)}
                        disabled={testingEndpointId === endpoint.id}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 relative"
                        title="Test endpoint"
                      >
                        {testingEndpointId === endpoint.id ? (
                          <div className="flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        ) : (
                          <Play className="w-4 h-4 text-gray-400" />
                        )}
                      </button>

                      <button
                        onClick={() => handleDeleteEndpoint(endpoint)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Delete endpoint"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {deleteModalOpen && endpointToDelete && (
        <DeleteEndpointModal
          endpoint={endpointToDelete}
          workspaceId={workspaceId}
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setEndpointToDelete(null);
          }}
          onSuccess={() => {
            setDeleteModalOpen(false);
            setEndpointToDelete(null);
            onEndpointDeleted();
          }}
        />
      )}

      {viewModalOpen && endpointToView && (
        <ViewEndpointModal
          endpoint={endpointToView}
          isOpen={viewModalOpen}
          onClose={() => {
            setViewModalOpen(false);
            setEndpointToView(null);
          }}
        />
      )}

      {testModalOpen && testResult && (
        <TestResultsModal
          result={testResult}
          endpointName={testResult.endpointName || "Unknown Endpoint"}
          isOpen={testModalOpen}
          onClose={() => {
            setTestModalOpen(false);
            setTestResult(null);
          }}
        />
      )}
    </>
  );
};

export default EndpointsTable;
