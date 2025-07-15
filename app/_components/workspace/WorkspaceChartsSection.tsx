import React from 'react'

interface WorkspaceChartsSectionProps {
  workspace: {
    id: string
    name: string
    endpointCount: number
    uptime: number
    avgResponseTime: number
    activeIncidents: number
    endpoints: any[]
  }
  className?: string
}

const WorkspaceChartsSection: React.FC<WorkspaceChartsSectionProps> = ({ 
  workspace, 
  className = "" 
}) => {
  // Don't show charts if no endpoints
  if (workspace.endpointCount === 0) {
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

  // TODO: When we have endpoints, show real charts
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
              <p className="text-xs text-gray-600 mt-1">{workspace.endpointCount} endpoint{workspace.endpointCount !== 1 ? 's' : ''} configured</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Summary - Show current workspace stats */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">Health Summary</h3>
            <p className="text-gray-400 text-sm">Current workspace status</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Overall Uptime</span>
              <span className={`font-semibold ${
                workspace.uptime >= 99 ? 'text-green-400' :
                workspace.uptime >= 95 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {workspace.uptime.toFixed(1)}%
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Average Response</span>
              <span className={`font-semibold ${
                workspace.avgResponseTime < 500 ? 'text-green-400' :
                workspace.avgResponseTime < 1000 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {workspace.avgResponseTime}ms
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Active Incidents</span>
              <span className={`font-semibold ${
                workspace.activeIncidents === 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {workspace.activeIncidents}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Endpoints Online</span>
              <span className="font-semibold text-white">
                {workspace.endpoints.filter(e => e.status === 'online').length}/{workspace.endpointCount}
              </span>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-gray-400">Health Score</span>
              <span className={`font-bold text-lg ${
                workspace.endpoints.filter(e => e.status === 'online').length === workspace.endpointCount ? 'text-green-400' :
                workspace.endpoints.filter(e => e.status === 'offline').length === 0 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {workspace.endpointCount > 0 ? 
                  Math.round((workspace.endpoints.filter(e => e.status === 'online').length / workspace.endpointCount) * 100) : 100}%
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activity - TODO: Add real activity when we have monitoring */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">Recent Activity</h3>
            <p className="text-gray-400 text-sm">Latest checks and incidents</p>
          </div>
          
          <div className="flex items-center justify-center h-[200px] text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">🔄</div>
              <p className="text-sm">Recent activity will appear here</p>
              <p className="text-xs text-gray-600 mt-1">Activity from endpoint monitoring</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkspaceChartsSection