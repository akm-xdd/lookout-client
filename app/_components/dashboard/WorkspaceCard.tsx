// components/dashboard/WorkspaceCard.tsx - MINIMAL FIXES
import React from "react";
import { MoreVertical, Clock, AlertCircle } from "lucide-react";
import {
  WorkspaceData,
  formatUptime,
  formatResponseTime,
  formatLastCheck,
  formatCreatedAt,
} from "@/lib/data-loader";

interface WorkspaceDataWithCreated extends WorkspaceData {
  createdAt: string;
}

interface WorkspaceCardProps {
  workspace: WorkspaceDataWithCreated;
  onClick?: () => void;
}

const WorkspaceCard: React.FC<WorkspaceCardProps> = ({
  workspace,
  onClick,
}) => {
  // Add safety checks for undefined properties
  const endpointCount = workspace.endpointCount ?? 0;
  const maxEndpoints = workspace.maxEndpoints ?? 7;
  const endpoints = workspace.endpoints ?? [];
  const uptime = workspace.uptime;
  const avgResponseTime = workspace.avgResponseTime;
  const activeIncidents = workspace.activeIncidents ?? 0;
  const status = workspace.status ?? 'unknown';
  
  const hasEndpoints = endpointCount > 0;
  const hasData = hasEndpoints && uptime !== null && avgResponseTime !== null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-400 bg-green-400/20";
      case "warning":
        return "text-yellow-400 bg-yellow-400/20";
      case "offline":
        return "text-red-400 bg-red-400/20";
      case "unknown":
        return "text-gray-400 bg-gray-400/20";
      default:
        return "text-gray-400 bg-gray-400/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return "●";
      case "warning":
        return "⚠";
      case "offline":
        return "●";
      case "unknown":
        return "○";
      default:
        return "○";
    }
  };

  return (
    <div
      className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:bg-white/8 transition-all cursor-pointer"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-2">
            <h3 className="text-lg font-semibold text-white">
              {workspace.name}
            </h3>

            {/* Only show status if there's at least one endpoint */}
            {hasEndpoints && (
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  status
                )}`}
              >
                <span className="mr-1">{getStatusIcon(status)}</span>
                {status}
              </div>
            )}
          </div>
        </div>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/10 rounded-lg">
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Endpoint Status Dots (or placeholder) */}
      <div className="flex items-center space-x-1 mb-4">
        {hasEndpoints ? (
          <>
            {endpoints.slice(0, 7).map((endpoint, i) => (
              <div
                key={endpoint.id || i}
                className={`w-2 h-2 rounded-full ${
                  endpoint.status === "online"
                    ? "bg-green-400"
                    : endpoint.status === "warning"
                    ? "bg-yellow-400"
                    : endpoint.status === "offline"
                    ? "bg-red-400"
                    : "bg-gray-400"
                }`}
                title={`${endpoint.name}: ${endpoint.status}`}
              />
            ))}
            {endpointCount > 7 && (
              <span className="text-xs text-gray-400 ml-2">
                +{endpointCount - 7}
              </span>
            )}
          </>
        ) : (
          <span className="text-xs text-gray-500 italic">
            No endpoints configured yet
          </span>
        )}
      </div>

      {/* Metrics Grid (endpoints always shown; uptime/response only if data exists) */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-400 mb-1">Endpoints</div>
          <div className="text-white font-medium">
            {endpointCount}/{maxEndpoints}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-400 mb-1">Uptime</div>
          <div className="text-white font-medium">
            {hasData ? formatUptime(uptime) : "—"}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-400 mb-1">Response</div>
          <div className="text-white font-medium">
            {hasData ? formatResponseTime(avgResponseTime) : "—"}
          </div>
        </div>
      </div>

      {/* Footer: last check or created at, plus incidents */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>
            {hasData && workspace.lastCheck
              ? formatLastCheck(workspace.lastCheck)
              : formatCreatedAt(workspace.createdAt || workspace.created_at)}
          </span>
        </div>
        {activeIncidents > 0 && (
          <div className="flex items-center space-x-1 text-red-400">
            <AlertCircle className="w-3 h-3" />
            <span>
              {activeIncidents} incident
              {activeIncidents !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspaceCard;