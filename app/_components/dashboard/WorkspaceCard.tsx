// components/dashboard/WorkspaceCard.tsx - FIXED RESPONSE TIME LOGIC

import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Clock, AlertCircle, Edit, Trash2 } from "lucide-react";
import { toast } from 'sonner'
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
  onEdit?: () => void;
  onDelete?: () => void;
}

const WorkspaceCard: React.FC<WorkspaceCardProps> = ({
  workspace,
  onClick,
  onEdit,
  onDelete,
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

  // FIXED: Smart response time display logic
  const shouldShowResponseTime = () => {
    // Don't show response time if:
    // 1. No endpoints or no data
    if (!hasData) return false;
    
    // 2. Workspace status is offline
    if (status === 'offline') return false;
    
    // 3. Uptime is 0% or very low (< 5%)
    if (uptime !== null && uptime < 5) return false;
    
    return true;
  };

  // Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
      case "operational": // ADD: Map operational to green
        return "text-green-400 bg-green-400/20";
      case "warning":
        return "text-yellow-400 bg-yellow-400/20";
      case "offline":
      case "down": // ADD: Map down to red
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
      case "operational": // ADD: Map operational to online icon
        return "●";
      case "warning":
        return "⚠";
      case "offline":
      case "down": // ADD: Map down to offline icon
        return "●";
      case "unknown":
        return "○";
      default:
        return "○";
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking on dropdown
    if (dropdownRef.current?.contains(e.target as Node)) {
      return;
    }
    onClick?.();
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(false);
    onEdit?.();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(false);
    onDelete?.();
  };

  return (
    <div
      className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:bg-white/8 transition-all cursor-pointer group relative"
      onClick={handleCardClick}
    >
      {/* Header with title, status and dropdown */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-white truncate max-w-[180px]">
            {workspace.name}
          </h3>
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(
              status
            )}`}
          >
            <span>{getStatusIcon(status)}</span>
            <span>{status}</span>
          </div>
        </div>

        {/* Dropdown Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleDropdownClick}
            className="p-2 text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 min-w-[120px]">
              <button
                onClick={handleEdit}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                <Edit className="w-3 h-3" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Endpoints indicator */}
      <div className="mb-4">
        <div className="text-gray-400 text-sm mb-1">Endpoints</div>
        <div className="text-white font-medium">
          {endpointCount}/{maxEndpoints}
        </div>
      </div>

      {/* Stats row: Uptime and Response time */}
      <div className="grid grid-cols-2 gap-6 mb-4">
        <div>
          <div className="text-sm text-gray-400 mb-1">Uptime</div>
          <div className="text-white font-medium">
            {hasData ? formatUptime(uptime) : "—"}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-400 mb-1">Response</div>
          <div className="text-white font-medium">
            {/* FIXED: Smart response time logic */}
            {shouldShowResponseTime() ? formatResponseTime(avgResponseTime) : "—"}
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