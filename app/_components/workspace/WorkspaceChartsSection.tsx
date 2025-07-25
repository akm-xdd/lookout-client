// ts-nocheck

import React from "react";
import { HealthSummaryStats } from "@/lib/workspace-transformers";
import { WorkspaceStatsIncident } from "@/hooks/useWorkspaceMetrics";

interface WorkspaceChartsSectionProps {
  workspaceData: {
    id: string;
    name: string;
    endpointCount?: number;
    uptime?: number | null;
    avgResponseTime?: number | null;
    activeIncidents?: number;
  };

  // Use monitoring data from unified endpoint
  endpointStats?: Array<{
    id: string;
    name: string;
    url: string;
    is_active: boolean;
    last_check_at: string | null;
    consecutive_failures: number;
    checks_last_24h: number;
    successful_checks_24h: number;
    avg_response_time_24h: string | null;
    last_check_success: boolean | null;
    last_status_code: number | null;
    last_response_time: number | null;
  }>;

  // Pre-calculated health stats from unified endpoint
  healthStats?: HealthSummaryStats;

  // Historical incidents from backend
  recentIncidents?: WorkspaceStatsIncident[];

  timeSeriesData?: Array<{
    timestamp: string;
    avg_response_time: number;
    uptime_percentage: number;
    total_checks: number;
    successful_checks: number;
  }>;

  className?: string;
}

const WorkspaceChartsSection: React.FC<WorkspaceChartsSectionProps> = ({
  workspaceData,
  endpointStats = [],
  healthStats,
  recentIncidents = [],
  timeSeriesData = [],
  className = "",
}) => {
  console.log("🔍 WorkspaceChartsSection DEBUG (UNIFIED):", {
    workspaceData,
    endpointStats,
    endpointStatsLength: endpointStats.length,
    healthStats,
    hasHealthStats: !!healthStats,
    healthStatsWeather: healthStats?.weather,
    healthStatsEmoji: healthStats?.weather_emoji,
    healthStatsDescription: healthStats?.weather_description,
    hasMonitoringData: endpointStats.length > 0,
    recentIncidents,
    incidentCount: recentIncidents.length,
  });

  const endpointCount = workspaceData.endpointCount ?? 0;
  const hasEndpoints = endpointCount > 0;
  const hasMonitoringData = endpointStats.length > 0;

  console.log("🔍 Calculated flags:", {
    endpointCount,
    hasEndpoints,
    hasMonitoringData,
    healthStatsActive: healthStats?.activeEndpoints,
  });

  // Use pre-calculated stats from backend instead of client-side calculation
  const stats = healthStats || {
    totalChecks: 0,
    successfulChecks: 0,
    overallUptime: null,
    avgResponseTime: null,
    onlineEndpoints: 0,
    warningEndpoints: 0,
    offlineEndpoints: 0,
    unknownEndpoints: endpointCount,
    activeEndpoints: 0,
    healthScore: null,
  };

  // Don't show charts if no endpoints
  if (endpointCount === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div>
          <h2 className="text-xl font-bold mb-2">Analytics</h2>
          <p className="text-gray-400 text-sm mb-6">
            Add endpoints to see performance metrics and trends
          </p>
        </div>

        {/* Empty State */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[
            {
              title: "Performance Weather",
              subtitle: "Workspace conditions",
              icon: "🌤️",
            },
            {
              title: "Endpoint Comparison",
              subtitle: "Response times",
              icon: "📊",
            },
            { title: "Health Summary", subtitle: "Current status", icon: "💚" },
            {
              title: "Recent Incidents",
              subtitle: "Issue tracking",
              icon: "🚨",
            },
          ].map((card, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-1">{card.title}</h3>
                <p className="text-gray-400 text-sm">{card.subtitle}</p>
              </div>

              <div className="flex items-center justify-center h-[200px] text-gray-500">
                <div className="text-center">
                  <div className="text-4xl mb-2">{card.icon}</div>
                  <p className="text-sm">
                    Add endpoints to see {card.title.toLowerCase()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h2 className="text-xl font-bold mb-2">Analytics</h2>
        <p className="text-gray-400 text-sm mb-6">
          Performance metrics and trends for this workspace
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Performance Weather - Fun and unique status indicator */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">Performance Weather</h3>
            <p className="text-gray-400 text-sm">
              Current workspace conditions
            </p>
          </div>

          <div className="flex items-center justify-center h-[200px]">
            <div className="text-center max-w-[280px] mx-auto px-4">
              <div className="text-6xl mb-3">
                {healthStats?.weather_emoji || "❓"}
              </div>
              <div className="mb-3">
                <h4 className="text-xl font-bold text-white mb-1">
                  {healthStats?.weather
                    ? healthStats.weather
                        .split("_")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")
                    : "Unknown"}
                </h4>
                <p className="text-gray-400 text-xs leading-relaxed">
                  {healthStats?.weather_description ||
                    "Loading weather data..."}
                </p>
              </div>

              {/* Weather details - Show basic stats if no weather data */}
              {healthStats?.healthScore !== null &&
              healthStats?.healthScore !== undefined ? (
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Health Score</span>
                    <span
                      className={`font-medium ${
                        healthStats.healthScore! >= 95
                          ? "text-green-400"
                          : healthStats.healthScore! >= 80
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {healthStats.healthScore!.toFixed(1)}%
                    </span>
                  </div>

                  {healthStats.offlineEndpoints + healthStats.warningEndpoints >
                    0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Active Issues</span>
                      <span className="font-medium text-red-400">
                        {healthStats.offlineEndpoints +
                          healthStats.warningEndpoints}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Forecast</span>
                    <span className="text-green-400">
                      {healthStats.offlineEndpoints +
                        healthStats.warningEndpoints ===
                      0
                        ? "Clear skies"
                        : "Clearing up"}
                    </span>
                  </div>
                </div>
              ) : (
                // Fallback when no health data available
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Endpoints</span>
                    <span className="font-medium text-white">
                      {endpointStats.length}
                    </span>
                  </div>
                  <div className="text-gray-500">Calculating weather...</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Endpoint Comparison - Using unified monitoring data */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">Endpoint Comparison</h3>
            <p className="text-gray-400 text-sm">Current response times</p>
          </div>

          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {endpointStats.map((stat) => (
              <div
                key={stat.id}
                className="flex items-center justify-between p-2 bg-white/5 rounded"
              >
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      !stat.is_active
                        ? "bg-gray-500"
                        : stat.last_check_success === true
                        ? "bg-green-500"
                        : stat.last_check_success === false
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  />
                  <span
                    className="text-sm text-white truncate max-w-[120px]"
                    title={stat.name}
                  >
                    {stat.name}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-white">
                    {/* Use 24h average instead of last response time for consistency */}
                    {stat.avg_response_time_24h
                      ? `${Math.round(
                          parseFloat(stat.avg_response_time_24h)
                        )}ms`
                      : stat.last_response_time
                      ? `${stat.last_response_time}ms`
                      : "—"}
                  </div>
                  <div className="text-xs text-gray-400">
                    {stat.checks_last_24h > 0
                      ? `${Math.round(
                          (stat.successful_checks_24h / stat.checks_last_24h) *
                            100
                        )}%`
                      : "No data"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Summary - With unified backend calculations */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">Health Summary</h3>
            <p className="text-gray-400 text-sm">Current workspace status</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Overall Uptime</span>
              <span
                className={`font-semibold ${
                  stats.overallUptime === null
                    ? "text-gray-400"
                    : stats.overallUptime >= 99
                    ? "text-green-400"
                    : stats.overallUptime >= 95
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {stats.overallUptime !== null
                  ? `${stats.overallUptime.toFixed(1)}%`
                  : "—"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400">Average Response</span>
              <span
                className={`font-semibold ${
                  stats.avgResponseTime === null
                    ? "text-gray-400"
                    : stats.avgResponseTime < 500
                    ? "text-green-400"
                    : stats.avgResponseTime < 1000
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {stats.avgResponseTime !== null
                  ? `${Math.round(stats.avgResponseTime)}ms`
                  : "—"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400">Total Checks (24h)</span>
              <span className="font-semibold text-white">
                {stats.totalChecks}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400">Endpoints Online</span>
              <span className="font-semibold text-white">
                {stats.onlineEndpoints}/{stats.activeEndpoints}
              </span>
            </div>

            {/* Health Score from Backend */}
            {stats.healthScore !== null && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Health Score</span>
                <span
                  className={`font-semibold ${
                    stats.healthScore >= 95
                      ? "text-green-400"
                      : stats.healthScore >= 80
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {stats.healthScore.toFixed(1)}%
                </span>
              </div>
            )}

            {/* Status Breakdown */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-gray-400">Online</span>
                </div>
                <span className="text-green-400">{stats.onlineEndpoints}</span>
              </div>

              {stats.warningEndpoints > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span className="text-gray-400">Warning</span>
                  </div>
                  <span className="text-yellow-400">
                    {stats.warningEndpoints}
                  </span>
                </div>
              )}

              {stats.offlineEndpoints > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-gray-400">Offline</span>
                  </div>
                  <span className="text-red-400">{stats.offlineEndpoints}</span>
                </div>
              )}

              {stats.unknownEndpoints > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500" />
                    <span className="text-gray-400">Unknown</span>
                  </div>
                  <span className="text-gray-400">
                    {stats.unknownEndpoints}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Incidents - Show historical incidents from backend */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">Recent Incidents</h3>
            <p className="text-gray-400 text-sm">Issues in the last 24 hours</p>
          </div>

          <div className="space-y-3 max-h-[200px] overflow-y-auto">
            {(() => {
              // Helper function to format duration
              const formatDuration = (minutes: number) => {
                if (minutes < 60) return `${minutes}m`;
                const hours = Math.floor(minutes / 60);
                const remainingMinutes = minutes % 60;
                if (hours < 24) {
                  return remainingMinutes > 0
                    ? `${hours}h ${remainingMinutes}m`
                    : `${hours}h`;
                }
                const days = Math.floor(hours / 24);
                const remainingHours = hours % 24;
                return remainingHours > 0
                  ? `${days}d ${remainingHours}h`
                  : `${days}d`;
              };

              // Helper function to format relative time
              const formatRelativeTime = (timestamp: string) => {
                const utcTimestamp =
                  timestamp.includes("Z") || timestamp.includes("+")
                    ? timestamp
                    : timestamp + "Z";
                const date = new Date(utcTimestamp);
                const now = new Date();
                const diffMs = now.getTime() - date.getTime();
                const diffMinutes = Math.floor(diffMs / (1000 * 60));

                if (diffMinutes < 60) return `${diffMinutes}m ago`;
                const diffHours = Math.floor(diffMinutes / 60);
                if (diffHours < 24) return `${diffHours}h ago`;
                const diffDays = Math.floor(diffHours / 24);
                return `${diffDays}d ago`;
              };

              // Show incidents or no incidents message
              if (recentIncidents.length === 0) {
                return (
                  <div className="flex items-center justify-center h-[120px] text-gray-500">
                    <div className="text-center">
                      <div className="text-3xl mb-2">✅</div>
                      <p className="text-sm">No incidents in 24h</p>
                      <p className="text-xs text-gray-600 mt-1">
                        All endpoints are healthy
                      </p>
                    </div>
                  </div>
                );
              }

              return recentIncidents.slice(0, 5).map((incident) => (
                <div
                  key={`${incident.endpoint_id}-${incident.start_time}`}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    incident.status === "ongoing"
                      ? "bg-red-900/20 border-red-500/30"
                      : "bg-yellow-900/20 border-yellow-500/30"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        incident.status === "ongoing"
                          ? "bg-red-500 animate-pulse"
                          : "bg-yellow-500"
                      }`}
                    />
                    <div>
                      <div className="text-sm font-medium text-white truncate max-w-[120px]">
                        {incident.endpoint_name}
                      </div>
                      <div
                        className={`text-xs ${
                          incident.status === "ongoing"
                            ? "text-red-300"
                            : "text-yellow-300"
                        }`}
                      >
                        {incident.status === "ongoing" ? "Ongoing" : "Resolved"}{" "}
                        • {formatDuration(incident.duration_minutes)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatRelativeTime(incident.start_time)}
                      </div>
                      {incident.cause &&
                        incident.cause !== "Connection failed" && (
                          <div
                            className="text-xs text-gray-500 truncate max-w-[150px]"
                            title={incident.cause}
                          >
                            {incident.cause}
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-xs font-medium ${
                        incident.status === "ongoing"
                          ? "text-red-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {incident.status_code > 0
                        ? `HTTP ${incident.status_code}`
                        : "Network Error"}
                    </div>
                    <div
                      className={`text-xs ${
                        incident.status === "ongoing"
                          ? "text-red-300"
                          : "text-yellow-300"
                      }`}
                    >
                      {incident.failure_count} failures
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>

          {/* Summary footer */}
          <div className="mt-4 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Total Incidents (24h)</span>
              <span
                className={`font-medium ${
                  recentIncidents.length > 0
                    ? recentIncidents.some((inc) => inc.status === "ongoing")
                      ? "text-red-400"
                      : "text-yellow-400"
                    : "text-green-400"
                }`}
              >
                {recentIncidents.length}
              </span>
            </div>
            {recentIncidents.some((inc) => inc.status === "ongoing") && (
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-gray-400">Currently Active</span>
                <span className="font-medium text-red-400">
                  {
                    recentIncidents.filter((inc) => inc.status === "ongoing")
                      .length
                  }
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceChartsSection;
