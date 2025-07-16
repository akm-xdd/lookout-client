// components/workspace/WorkspaceChartsSection.tsx - FIXED HEALTH SUMMARY LOGIC
import React from 'react'
import { formatUptime, formatResponseTime } from '@/lib/data-loader'

interface WorkspaceChartsSectionProps {
  workspaceData: {
    id: string
    name: string
    endpointCount?: number
    uptime?: number | null
    avgResponseTime?: number | null
    activeIncidents?: number
    endpoints?: any[]
    endpointData?: any[]
  }
  className?: string
}

const WorkspaceChartsSection: React.FC<WorkspaceChartsSectionProps> = ({ 
  workspaceData, 
  className = "" 
}) => {
  // Add safety checks for all properties
  const endpointCount = workspaceData.endpointCount ?? 0
  const uptime = workspaceData.uptime
  const avgResponseTime = workspaceData.avgResponseTime
  const activeIncidents = workspaceData.activeIncidents ?? 0
  const endpoints = workspaceData.endpoints ?? workspaceData.endpointData ?? []

  const hasEndpoints = endpointCount > 0
  const hasData = hasEndpoints && uptime !== null && avgResponseTime !== null

  // Calculate actual endpoint statuses
  const onlineEndpoints = endpoints.filter((e: any) => e.status === 'online').length
  const warningEndpoints = endpoints.filter((e: any) => e.status === 'warning').length
  const offlineEndpoints = endpoints.filter((e: any) => e.status === 'offline').length
  const unknownEndpoints = endpoints.filter((e: any) => e.status === 'unknown').length

  // Only show actual health score if we have real monitoring data
  const hasMonitoringData = endpoints.some((e: any) => 
    e.status === 'online' || e.status === 'offline' || e.status === 'warning'
  )

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
          {/* Placeholder Cards */}
          {[
            { title: 'Response Time Trend', subtitle: 'Last 24 hours', icon: '⚡' },
            { title: 'Endpoint Comparison', subtitle: 'Response times', icon: '📊' },
            { title: 'Health Summary', subtitle: 'Current status', icon: '💚' },
            { title: 'Recent Activity', subtitle: 'Latest checks', icon: '🔄' }
          ].map((card, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-1">{card.title}</h3>
                <p className="text-gray-400 text-sm">{card.subtitle}</p>
              </div>
              
              <div className="flex items-center justify-center h-[200px] text-gray-500">
                <div className="text-center">
                  <div className="text-4xl mb-2">{card.icon}</div>
                  <p className="text-sm">Add endpoints to see {card.title.toLowerCase()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
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
        {/* Response Time Trend - TODO: Add real chart when we have monitoring data */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">Response Time Trend</h3>
            <p className="text-gray-400 text-sm">Last 24 hours</p>
          </div>
          
          <div className="flex items-center justify-center h-[200px] text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">📈</div>
              <p className="text-sm">Monitoring data will appear here</p>
              <p className="text-xs text-gray-600 mt-1">Start monitoring to see trends</p>
            </div>
          </div>
        </div>

        {/* Endpoint Comparison - TODO: Add real chart */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">Endpoint Comparison</h3>
            <p className="text-gray-400 text-sm">Current response times</p>
          </div>
          
          <div className="flex items-center justify-center h-[200px] text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-sm">Endpoint comparison will appear here</p>
              <p className="text-xs text-gray-600 mt-1">{endpointCount} endpoint{endpointCount !== 1 ? 's' : ''} configured</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Summary - FIXED LOGIC */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">Health Summary</h3>
            <p className="text-gray-400 text-sm">Current workspace status</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Overall Uptime</span>
              <span className={`font-semibold ${
                hasData ? (
                  uptime! >= 99 ? 'text-green-400' :
                  uptime! >= 95 ? 'text-yellow-400' : 'text-red-400'
                ) : 'text-gray-400'
              }`}>
                {hasData ? formatUptime(uptime) : '—'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Average Response</span>
              <span className={`font-semibold ${
                hasData ? (
                  avgResponseTime! < 500 ? 'text-green-400' :
                  avgResponseTime! < 1000 ? 'text-yellow-400' : 'text-red-400'
                ) : 'text-gray-400'
              }`}>
                {hasData ? formatResponseTime(avgResponseTime) : '—'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Active Incidents</span>
              <span className={`font-semibold ${
                activeIncidents === 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {activeIncidents}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Endpoints Online</span>
              <span className="font-semibold text-white">
                {hasMonitoringData ? `${onlineEndpoints}/${endpointCount}` : `—/${endpointCount}`}
              </span>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-gray-400">Health Score</span>
              <span className={`font-bold text-lg ${
                !hasMonitoringData ? 'text-gray-400' :
                onlineEndpoints === endpointCount ? 'text-green-400' :
                offlineEndpoints === 0 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {!hasMonitoringData ? '—' : 
                 endpointCount > 0 ? `${Math.round((onlineEndpoints / endpointCount) * 100)}%` : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activity - TODO: Add real activity when we have monitoring data */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">Recent Activity</h3>
            <p className="text-gray-400 text-sm">Latest monitoring checks</p>
          </div>
          
          <div className="flex items-center justify-center h-[200px] text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">🔄</div>
              <p className="text-sm">Activity feed will appear here</p>
              <p className="text-xs text-gray-600 mt-1">
                {hasData ? 'Monitoring data coming soon' : 'No monitoring data available'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkspaceChartsSection