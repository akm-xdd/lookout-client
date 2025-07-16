// components/dashboard/StatusDistributionChart.tsx - FIXED FOR NO MONITORING DATA
"use client"

import { Pie, PieChart, Cell } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { DashboardData, getDashboardStats } from "@/lib/data-loader"

interface StatusDistributionChartProps {
  data: DashboardData
  className?: string
}

const chartConfig = {
  online: {
    label: "Online",
    color: "hsl(142 71% 45%)", // green-500
  },
  warning: {
    label: "Warning", 
    color: "hsl(48 96% 53%)", // yellow-500
  },
  offline: {
    label: "Offline",
    color: "hsl(0 84% 60%)", // red-500
  },
} satisfies ChartConfig

const StatusDistributionChart: React.FC<StatusDistributionChartProps> = ({ 
  data, 
  className = "" 
}) => {
  const stats = getDashboardStats(data)
  const totalEndpoints = stats.totalEndpoints

  // Check if we have any endpoints with actual monitoring data
  const allEndpoints = data.workspaces.flatMap(ws => ws.endpoints || [])
  const hasMonitoringData = allEndpoints.some(endpoint => 
    endpoint.status === 'online' || endpoint.status === 'offline' || endpoint.status === 'warning'
  )

  // Don't show chart if no endpoints exist
  if (totalEndpoints === 0) {
    return (
      <div className={`bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 ${className}`}>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-1">Endpoint Status</h3>
          <p className="text-gray-400 text-sm">Distribution overview</p>
        </div>
        <div className="flex items-center justify-center h-[200px] text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">🎯</div>
            <p className="text-sm">Add endpoints to see status distribution</p>
          </div>
        </div>
      </div>
    )
  }

  // Show "No monitoring data" state if endpoints exist but no monitoring has started
  if (!hasMonitoringData) {
    return (
      <div className={`bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 ${className}`}>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-1">Endpoint Status</h3>
          <p className="text-gray-400 text-sm">{totalEndpoints} total endpoint{totalEndpoints !== 1 ? 's' : ''}</p>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* Placeholder Chart Area */}
          <div className="flex-shrink-0 w-[160px] h-[160px] flex items-center justify-center">
            <div className="w-24 h-24 border-4 border-gray-600 border-dashed rounded-full flex items-center justify-center">
              <div className="text-2xl">📊</div>
            </div>
          </div>
          
          {/* Status Information */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-gray-500" />
                <span className="text-sm text-gray-300">Configured</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{totalEndpoints}</div>
                <div className="text-xs text-gray-400">100%</div>
              </div>
            </div>
            
            {/* Monitoring Status */}
            <div className="pt-3 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Status</span>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-400">Unknown</div>
                  <div className="text-xs text-gray-500">No monitoring data</div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="pt-2">
              <div className="text-xs text-gray-500">
                Monitoring will start automatically once configured
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show actual chart only when we have real monitoring data
  const legendData = [
    { status: 'online', count: stats.onlineEndpoints, label: 'Online', color: chartConfig.online.color },
    { status: 'warning', count: stats.warningEndpoints, label: 'Warning', color: chartConfig.warning.color },
    { status: 'offline', count: stats.offlineEndpoints, label: 'Offline', color: chartConfig.offline.color },
  ].filter(item => item.count > 0)

  return (
    <div className={`bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-1">Endpoint Status</h3>
        <p className="text-gray-400 text-sm">{totalEndpoints} total endpoint{totalEndpoints !== 1 ? 's' : ''}</p>
      </div>
      
      <div className="flex items-center space-x-6">
        {/* Donut Chart */}
        <div className="flex-shrink-0">
          <ChartContainer
            config={chartConfig}
            className="w-[160px] h-[160px]"
          >
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent hideLabel />}
                cursor={false}
              />
              <Pie
                data={[
                  { name: "Online", value: stats.onlineEndpoints, fill: chartConfig.online.color },
                  { name: "Warning", value: stats.warningEndpoints, fill: chartConfig.warning.color },
                  { name: "Offline", value: stats.offlineEndpoints, fill: chartConfig.offline.color },
                ].filter(item => item.value > 0)}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={60}
                innerRadius={30}
                dataKey="value"
                nameKey="name"
                strokeWidth={2}
                stroke="rgba(0, 0, 0, 0.1)"
              >
                {legendData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>
        
        {/* Legend & Stats */}
        <div className="flex-1 space-y-3">
          {legendData.map((item) => (
            <div key={item.status} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-300">{item.label}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{item.count}</div>
                <div className="text-xs text-gray-400">
                  {((item.count / totalEndpoints) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          ))}
          
          {/* Health Score */}
          <div className="pt-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Health Score</span>
              <div className="text-right">
                <div className={`text-sm font-medium ${
                  stats.onlineEndpoints === totalEndpoints ? 'text-green-400' :
                  stats.offlineEndpoints === 0 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {Math.round((stats.onlineEndpoints / totalEndpoints) * 100)}%
                </div>
                <div className="text-xs text-gray-400">
                  {stats.onlineEndpoints === totalEndpoints ? 'Excellent' :
                   stats.offlineEndpoints === 0 ? 'Good' : 'Needs Attention'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatusDistributionChart