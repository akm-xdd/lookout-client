import React from 'react'
import UptimeChart from './UptimeChart'
import ResponseTimeChart from './ResponseTimeChart'
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
  const totalEndpoints = data.workspaces?.reduce((sum, ws) => sum + ws.endpointCount, 0)
  
  if (data.workspaces.length === 0 || totalEndpoints === 0) {
    return null
  }

  return (
    <div className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Analytics Overview</h2>
        <p className="text-gray-400">Performance metrics and trends across all endpoints</p>
      </div>
      
      {/* Top Row: Time-based Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Uptime Chart - Only show if we have uptime history (7 days) */}
        {data.overview.uptimeHistory.length > 0 ? (
          <UptimeChart data={data.overview} />
        ) : (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-1">Uptime Trend</h3>
              <p className="text-gray-400 text-sm">Available after 7 days of monitoring</p>
            </div>
            <div className="flex items-center justify-center h-[200px] text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <p>Keep monitoring to see uptime trends</p>
                <p className="text-sm mt-1">Data will appear after 7 days</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Response Time Chart - Only show if we have response time history (24h) */}
        {data.overview.responseTimeHistory.length > 0 ? (
          <ResponseTimeChart data={data.overview} />
        ) : (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-1">Response Time</h3>
              <p className="text-gray-400 text-sm">Past 24 hours hourly average</p>
            </div>
            <div className="flex items-center justify-center h-[200px] text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">⚡</div>
                <p>Start monitoring to track response times</p>
                <p className="text-sm mt-1">Hourly averages over 24 hours</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Bottom Row: Performance and Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* NEW: Combined Performance Card - Best & Worst in one */}
        {(data.overview.bestPerformingEndpoints.length > 0 || data.overview.worstPerformingEndpoints.length > 0) ? (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-1">Performance Overview</h3>
              <p className="text-gray-400 text-sm">Best and worst endpoints in the past 24 hours</p>
            </div>
            
            <div className="space-y-4">
              {/* Best Performing Section */}
              {data.overview.bestPerformingEndpoints.length > 0 && (
                <div>
                  <div className="flex items-center mb-3">
                    <span className="text-green-400 mr-2">🏆</span>
                    <span className="text-sm font-medium text-green-400">Best Performing</span>
                  </div>
                  <div className="space-y-2">
                    {data.overview.bestPerformingEndpoints.slice(0, 1).map((endpoint, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div>
                          <div className="font-medium text-white text-sm">{endpoint.endpointName}</div>
                          <div className="text-xs text-gray-400">{endpoint.workspaceName}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-400">{endpoint.avgResponseTime}ms</div>
                          <div className="text-xs text-gray-400">{endpoint.uptime.toFixed(1)}% uptime</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Separator if both sections exist */}
              {data.overview.bestPerformingEndpoints.length > 0 && data.overview.worstPerformingEndpoints.length > 0 && (
                <div className="border-t border-white/10"></div>
              )}

              {/* Worst Performing Section */}
              {data.overview.worstPerformingEndpoints.length > 0 ? (
                <div>
                  <div className="flex items-center mb-3">
                    <span className="text-yellow-400 mr-2">⚠️</span>
                    <span className="text-sm font-medium text-yellow-400">Needs Attention</span>
                  </div>
                  <div className="space-y-2">
                    {data.overview.worstPerformingEndpoints.slice(0, 2).map((endpoint, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <div>
                          <div className="font-medium text-white text-sm">{endpoint.endpointName}</div>
                          <div className="text-xs text-gray-400">{endpoint.workspaceName}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-yellow-400">{endpoint.avgResponseTime}ms</div>
                          <div className="text-xs text-gray-400">{endpoint.uptime.toFixed(1)}% uptime</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // Show positive message if no worst performing endpoints
                data.overview.bestPerformingEndpoints.length > 0 && (
                  <div>
                    <div className="flex items-center mb-3">
                      <span className="text-green-400 mr-2">✅</span>
                      <span className="text-sm font-medium text-green-400">All Active Endpoints Performing Well</span>
                    </div>
                    <div className="flex items-center justify-center h-[60px] text-gray-500">
                      <p className="text-sm">No performance issues detected!</p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        ) : (
          // Empty state for performance card
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-1">Performance Overview</h3>
              <p className="text-gray-400 text-sm">Best and worst endpoints</p>
            </div>
            <div className="flex items-center justify-center h-[180px] text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <p>Not enough performance data yet</p>
                <p className="text-sm mt-1">Keep monitoring to see trends</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Recent Incidents */}
        <RecentIncidentsList data={data} />
      </div>

      {/* REMOVED: Performance Section - Best/Worst Endpoints */}
      {/* This section has been consolidated into the single Performance Overview card above */}
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

      {/* Performance section skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-white/10 rounded w-40 mb-1"></div>
              <div className="h-4 bg-white/10 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-16 bg-white/10 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChartsSection
