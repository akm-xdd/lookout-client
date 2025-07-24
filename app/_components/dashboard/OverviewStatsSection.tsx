import React from 'react'
import { Layers, Globe, TrendingUp, AlertTriangle } from 'lucide-react'
import OverviewStatCard from './OverviewStatCard'
import { DashboardData, getDashboardStats } from '@/lib/data-loader'

interface OverviewStatsSectionProps {
  data: DashboardData
  loading?: boolean
}

const OverviewStatsSection: React.FC<OverviewStatsSectionProps> = ({ 
  data, 
  loading = false 
}) => {
  if (loading) {
    return <OverviewStatsLoading />
  }

  // Add safety check for data
  if (!data) {
    return <OverviewStatsLoading />
  }

  const stats = getDashboardStats(data)

  // Helper function to safely format uptime
  const formatUptimeValue = (uptime: number | null | undefined) => {
    if (uptime === null || uptime === undefined || typeof uptime !== 'number') {
      return '—'
    }
    return `${uptime.toFixed(1)}%`
  }

  // Helper function to get uptime color
  const getUptimeColor = (uptime: number | null | undefined) => {
    if (uptime === null || uptime === undefined || typeof uptime !== 'number') {
      return 'blue'
    }
    if (uptime >= 99) return 'green'
    if (uptime >= 95) return 'yellow'
    return 'red'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {/* Workspaces */}
      <OverviewStatCard
        title="Workspaces"
        value={`${stats.totalWorkspaces}/${data.user?.limits.maxWorkspaces ?? 5}`}
        subtitle={stats.totalWorkspaces === 0 ? 'Get started' : 'Active projects'}
        icon={Layers}
        color="blue"
        progress={{
          current: stats.totalWorkspaces,
          max: data.user?.limits.maxWorkspaces ?? 5
        }}
      />

      {/* Total Endpoints */}
      <OverviewStatCard
        title="Total Endpoints"
        value={`${stats.totalEndpoints}/${data.user?.limits.maxTotalEndpoints ?? 35}`}
        subtitle={stats.totalEndpoints === 0 ? 'No monitoring yet' : 'Configured endpoints'}
        icon={Globe}
        color="purple"
        progress={{
          current: stats.totalEndpoints,
          max: data.user?.limits.maxTotalEndpoints ?? 35
        }}
      />

      {/* Overall Uptime - SAFELY HANDLED */}
      <OverviewStatCard
        title="Overall Uptime"
        value={formatUptimeValue(stats.avgUptime)}
        subtitle={stats.totalEndpoints === 0 ? 'No data yet' : stats.avgUptime === null ? 'No monitoring data' : 'Last 30 days'}
        icon={TrendingUp}
        color={getUptimeColor(stats.avgUptime)}
      />

      {/* Active Incidents */}
      <OverviewStatCard
        title="Active Incidents"
        value={stats.activeIncidents}
        subtitle={stats.activeIncidents === 0 ? 'All systems operational' : 'Needs attention'}
        icon={AlertTriangle}
        color={stats.activeIncidents === 0 ? 'green' : 'red'}
      />
    </div>
  )
}

// Loading skeleton component
const OverviewStatsLoading: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {[...Array(4)].map((_, i) => (
        <div 
          key={i}
          className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
        >
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-white/10 rounded w-20"></div>
              <div className="h-5 w-5 bg-white/10 rounded"></div>
            </div>
            <div className="h-8 bg-white/10 rounded w-16 mb-2"></div>
            <div className="h-3 bg-white/10 rounded w-24"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default OverviewStatsSection
