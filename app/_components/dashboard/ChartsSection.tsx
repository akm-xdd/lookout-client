// components/dashboard/ChartsSection.tsx
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

  // Don't show charts if no data
  if (data.workspaces.length === 0) {
    return null
  }

  return (
    <div className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Analytics Overview</h2>
        <p className="text-gray-400">Monitor performance and track incidents across all endpoints</p>
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Uptime Chart */}
        <UptimeChart data={data.overview} />
        
        {/* Response Time Chart */}
        <ResponseTimeChart data={data.overview} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <StatusDistributionChart data={data} />
        
        {/* Recent Incidents */}
        <RecentIncidentsList data={data} />
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