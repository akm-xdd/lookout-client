// components/dashboard/ChartsSection.tsx - API ONLY
import React from 'react'
import UptimeChart from './UptimeChart'
import ResponseTimeChart from './ResponseTimeChart'
import StatusDistributionChart from './StatusDistributionChart'
import RecentIncidentsList from './RecentIncidentsList'
import { DashboardData } from '@/lib/data-loader'

interface ChartsSectionProps {
  data: DashboardData
  loading?: boolean
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ data, loading = false }) => {
  if (loading) {
    return <ChartsSectionLoading />
  }

  // Don't show charts if no workspaces OR no endpoints
  const totalEndpoints = data.workspaces.reduce((sum, ws) => sum + ws.endpointCount, 0)
  
  if (data.workspaces.length === 0 || totalEndpoints === 0) {
    return null
  }

  return (
    <div className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Analytics Overview</h2>
        <p className="text-gray-400">Performance metrics and trends across all endpoints</p>
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Uptime Chart - Only show if we have uptime history */}
        {data.overview.uptimeHistory.length > 0 && (
          <UptimeChart data={data.overview} />
        )}
        
        {/* Response Time Chart - Only show if we have response time history */}
        {data.overview.responseTimeHistory.length > 0 && (
          <ResponseTimeChart data={data.overview} />
        )}
        
        {/* If no historical data, show placeholders */}
        {data.overview.uptimeHistory.length === 0 && (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-1">Uptime Trend</h3>
              <p className="text-gray-400 text-sm">Last 7 days</p>
            </div>
            <div className="flex items-center justify-center h-[200px] text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <p>Start monitoring to see uptime trends</p>
              </div>
            </div>
          </div>
        )}
        
        {data.overview.responseTimeHistory.length === 0 && (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-1">Response Time</h3>
              <p className="text-gray-400 text-sm">Last 24 hours</p>
            </div>
            <div className="flex items-center justify-center h-[200px] text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">⚡</div>
                <p>Add endpoints to track response times</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution - Only show if we have endpoints */}
        {totalEndpoints > 0 && (
          <StatusDistributionChart data={data} />
        )}
        
        {/* Recent Incidents */}
        <RecentIncidentsList data={data} />
        
        {/* If no endpoints, show status placeholder */}
        {totalEndpoints === 0 && (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-1">Endpoint Status</h3>
              <p className="text-gray-400 text-sm">Distribution overview</p>
            </div>
            <div className="flex items-center justify-center h-[200px] text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">🎯</div>
                <p>Add endpoints to see status distribution</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Loading skeleton for charts section
const ChartsSectionLoading: React.FC = () => {
  return (
    <div className="mb-12">
      <div className="mb-6">
        <div className="h-8 bg-white/10 rounded w-48 mb-2 animate-pulse"></div>
        <div className="h-4 bg-white/10 rounded w-96 animate-pulse"></div>
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-white/10 rounded w-32 mb-1"></div>
              <div className="h-4 bg-white/10 rounded w-24 mb-4"></div>
              <div className="h-[200px] bg-white/10 rounded"></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-white/10 rounded w-32 mb-1"></div>
              <div className="h-4 bg-white/10 rounded w-24 mb-4"></div>
              <div className="h-[200px] bg-white/10 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChartsSection