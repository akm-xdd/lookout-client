import { useQuery, useQueryClient } from '@tanstack/react-query'
import { dashboardAPI } from '@/lib/api-client'
import { DashboardData } from '@/lib/data-loader'
import { queryKeys } from '@/lib/query-client'

export const useDashboard = () => {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: async (): Promise<DashboardData> => {
      console.log('🔄 Fetching dashboard data via TanStack Query...')
      
      // Use your existing dashboard API
      const dashboardResponse = await dashboardAPI.getDashboard()
      
      console.log('✅ Dashboard data loaded:', dashboardResponse)
      
      // Transform the backend response to frontend format (using your existing logic)
      return {
        user: {
          id: dashboardResponse.user.id,
          email: dashboardResponse.user.email,
          maxWorkspaces: dashboardResponse.user.limits.max_workspaces,
          maxEndpoints: dashboardResponse.user.limits.max_total_endpoints
        },
        workspaces: dashboardResponse.workspaces.map(workspace => ({
          id: workspace.id,
          name: workspace.name,
          description: workspace.description || '',
          created_at: workspace.created_at,
          updated_at: workspace.updated_at,
          user_id: workspace.user_id,
          endpointCount: workspace.endpoint_count,
          maxEndpoints: 7,
          status: workspace.endpoints.length === 0 ? 'unknown' as const : 'unknown' as const,
          uptime: null,
          avgResponseTime: null,
          lastCheck: null,
          activeIncidents: 0,
          endpoints: workspace.endpoints.map(endpoint => ({
            id: endpoint.id,
            name: endpoint.name,
            url: endpoint.url,
            method: endpoint.method,
            status: endpoint.is_active ? 'unknown' as const : 'offline' as const,
            uptime: null,
            responseTime: null,
            lastCheck: null,
            frequency: endpoint.frequency_minutes
          }))
        })),
        overview: {
          totalEndpoints: dashboardResponse.overview.total_endpoints,
          activeEndpoints: dashboardResponse.overview.active_endpoints,
          avgUptime: null,
          avgResponseTime: null,
          activeIncidents: 0,
          uptimeHistory: [], // Empty for now
          responseTimeHistory: [] // Empty for now
        },
        recentIncidents: []
      }
    },
    staleTime: 3 * 60 * 1000, // 3 minutes (dashboard data changes more frequently)
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
  })
}

// Export a manual refresh function for future use
export const useRefreshDashboard = () => {
  const queryClient = useQueryClient()
  
  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })
  }
}