// components/workspace/WorkspaceChartsSection.tsx - UPDATED WITH REAL DATA
import React from "react";
import { formatUptime, formatResponseTime } from "@/lib/data-loader";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WorkspaceChartsSectionProps {
  workspaceData: {
    id: string;
    name: string;
    endpointCount?: number;
    uptime?: number | null;
    avgResponseTime?: number | null;
    activeIncidents?: number;
    endpoints?: any[];
    endpointData?: any[];
  };
  // NEW: Pass endpoint stats for real monitoring data
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
  timeSeriesData = [],
  className = "",
}) => {

  console.log('🔍 WorkspaceChartsSection DEBUG:', {
    workspaceData,
    endpointStats,
    endpointStatsLength: endpointStats.length,
    hasMonitoringData: endpointStats.length > 0
  });

   endpointStats.forEach((stat, index) => {
    console.log(`🔍 Endpoint ${index + 1}:`, {
      id: stat.id,
      name: stat.name,
      url: stat.url,
      is_active: stat.is_active,
      last_check_at: stat.last_check_at,
      last_response_time: stat.last_response_time,
      avg_response_time_24h: stat.avg_response_time_24h,
      checks_last_24h: stat.checks_last_24h,
      successful_checks_24h: stat.successful_checks_24h,
      last_check_success: stat.last_check_success,
      last_status_code: stat.last_status_code,
      consecutive_failures: stat.consecutive_failures
    });
  });

  const endpointCount = workspaceData.endpointCount ?? 0;
  const endpoints = workspaceData.endpoints ?? workspaceData.endpointData ?? [];

  const hasEndpoints = endpointCount > 0;
  const hasMonitoringData = endpointStats.length > 0;

  console.log('🔍 Calculated flags:', {
    endpointCount,
    hasEndpoints,
    hasMonitoringData,
    endpointsArray: endpoints
  });

  const calculateRealStats = () => {
    if (!hasMonitoringData) {
      return {
        totalChecks: 0,
        successfulChecks: 0,
        overallUptime: null,
        avgResponseTime: null,
        onlineEndpoints: 0,
        warningEndpoints: 0,
        offlineEndpoints: 0,
        unknownEndpoints: endpointCount,
        activeEndpoints: 0, // NEW: Track active endpoints separately
        healthScore: null, // NEW: Calculated health score
      };
    }

    let totalChecks = 0;
    let successfulChecks = 0;
    let responseTimes: number[] = [];
    let onlineEndpoints = 0;
    let warningEndpoints = 0;
    let offlineEndpoints = 0;
    let unknownEndpoints = 0;
    let activeEndpoints = 0; // NEW: Count only active endpoints

    endpointStats.forEach((stat) => {
      // Aggregate check data
      totalChecks += stat.checks_last_24h || 0;
      successfulChecks += stat.successful_checks_24h || 0;

      // Collect response times
      if (stat.avg_response_time_24h) {
        responseTimes.push(parseFloat(stat.avg_response_time_24h));
      }

      // Determine status and count
      if (!stat.is_active) {
        // CHANGED: Don't count deactivated endpoints in health calculation
        // They're just "paused", not "failed"
      } else {
        activeEndpoints++; // NEW: Count active endpoints

        if (stat.last_check_success === true) {
          onlineEndpoints++;
        } else if (stat.last_check_success === false) {
          if ((stat.consecutive_failures || 0) >= 3) {
            offlineEndpoints++;
          } else {
            warningEndpoints++;
          }
        } else {
          unknownEndpoints++;
        }
      }
    });

    // NEW: Calculate health score only from active endpoints
    const healthScore =
      activeEndpoints === 0
        ? null // No active endpoints to monitor
        : Math.round((onlineEndpoints / activeEndpoints) * 100);

    return {
      totalChecks,
      successfulChecks,
      overallUptime:
        totalChecks > 0 ? (successfulChecks / totalChecks) * 100 : null,
      avgResponseTime:
        responseTimes.length > 0
          ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
          : null,
      onlineEndpoints,
      warningEndpoints,
      offlineEndpoints,
      unknownEndpoints,
      activeEndpoints, // NEW
      healthScore, // NEW
    };
  };

  const stats = calculateRealStats();

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
              title: "Response Time Trend",
              subtitle: "Last 24 hours",
              icon: "⚡",
            },
            {
              title: "Endpoint Comparison",
              subtitle: "Response times",
              icon: "📊",
            },
            { title: "Health Summary", subtitle: "Current status", icon: "💚" },
            { title: "Recent Activity", subtitle: "Latest checks", icon: "🔄" },
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
        {/* Response Time Trend - TODO: Add real chart when we have time series data */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">Response Time Trend</h3>
            <p className="text-gray-400 text-sm">Last 24 hours</p>
          </div>

          {timeSeriesData.length > 0 ? (
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickFormatter={(value) => new Date(value).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickFormatter={(value) => `${value}ms`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                    formatter={(value: number) => [`${value}ms`, 'Response Time']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="avg_response_time" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">📈</div>
                <p className="text-sm">No time series data available</p>
                {stats.avgResponseTime && (
                  <p className="text-xs text-gray-600 mt-1">
                    Current avg: {Math.round(stats.avgResponseTime)}ms
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Endpoint Comparison - TODO: Add real chart */}
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
                    {stat.last_response_time
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
        {/* Health Summary - NOW WITH REAL DATA */}
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
                {stats.onlineEndpoints}/{endpointCount}
              </span>
            </div>

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

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-gray-400">Health Score</span>
              <span
                className={`font-bold text-lg ${
                  stats.healthScore === null
                    ? "text-gray-400"
                    : stats.healthScore >= 95
                    ? "text-green-400"
                    : stats.healthScore >= 80
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {stats.healthScore !== null ? `${stats.healthScore}%` : "N/A"}
              </span>
            </div>

            {/* NEW: Show active vs total context */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Active Monitoring</span>
              <span>
                {stats.activeEndpoints}/{endpointCount} endpoints
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activity - TODO: Add real activity when we have time series */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">Recent Activity</h3>
            <p className="text-gray-400 text-sm">Latest monitoring status</p>
          </div>

          <div className="space-y-3 max-h-[200px] overflow-y-auto">
            {endpointStats.map((stat) => (
              <div
                key={stat.id}
                className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg"
              >
                <div
                  className={`w-3 h-3 rounded-full mt-1 ${
                    !stat.is_active
                      ? "bg-gray-500"
                      : stat.last_check_success === true
                      ? "bg-green-500"
                      : stat.last_check_success === false
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-white truncate">
                    {stat.name}
                  </h4>
                  <p className="text-xs text-gray-400">
                    {stat.last_check_at
                      ? `Last checked: ${new Date(
                          stat.last_check_at
                        ).toLocaleTimeString()}`
                      : "Never checked"}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                    {stat.last_status_code && (
                      <span>Status: {stat.last_status_code}</span>
                    )}
                    {stat.consecutive_failures > 0 && (
                      <span className="text-red-400">
                        {stat.consecutive_failures} failures
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceChartsSection;
