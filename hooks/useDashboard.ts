import { useQuery } from '@tanstack/react-query'
import { dashboardAPI } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-client'

// Types for the new comprehensive dashboard response
export interface DashboardUser {
  id: string
  email: string
  limits: {
    max_workspaces: number
    max_total_endpoints: number
  }
  current: {
    workspace_count: number
    total_endpoints: number
  }
}

export interface DashboardEndpoint {
  id: string
  name: string
  url: string
  method: string
  headers: Record<string, string>
  body: string | null
  expected_status: number
  frequency_minutes: number
  timeout_seconds: number
  is_active: boolean
  created_at: string
  workspace_id: string
}

export interface DashboardWorkspace {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
  user_id: string
  endpoint_count: number
  endpoints: DashboardEndpoint[]
}

export interface EndpointPerformance {
  endpointName: string
  workspaceName: string
  avgResponseTime: number
  uptime: number
}

export interface DashboardOverview {
  total_endpoints: number
  active_endpoints: number
  total_workspaces: number
  uptimeHistory: Array<{ date: string; uptime: number }>
  responseTimeHistory: Array<{ timestamp: string; avgResponseTime: number }>
  bestPerformingEndpoints: EndpointPerformance[]
  worstPerformingEndpoints: EndpointPerformance[]
}

export interface DashboardIncident {
  id: string
  endpointName: string
  workspaceName: string
  status: 'ongoing' | 'resolved'
  cause: string
  duration: number
  responseCode: number
  startTime: string
  endTime: string | null
}

export interface DashboardStats {
  user: DashboardUser
  workspaces: DashboardWorkspace[]
  overview: DashboardOverview
  recentIncidents: DashboardIncident[]
}

// Transform the backend response to match frontend expectations
function transformDashboardData(backendData: any): any {
  // Transform workspaces - backend now provides workspace-level metrics
  const transformedWorkspaces = backendData.workspaces.map((workspace: any) => {
    // Transform endpoints to include status (this will need endpoint stats)
    const transformedEndpoints = workspace.endpoints.map((endpoint: DashboardEndpoint) => ({
      ...endpoint,
      // Add status calculation based on is_active and any monitoring data
      // For now, we'll use a simple status based on is_active
      status: endpoint.is_active ? 'unknown' : 'offline',
      uptime: null,
      avgResponseTime: null,
      lastCheck: null,
    }))

    return {
      ...workspace,
      endpoints: transformedEndpoints,
      endpointCount: workspace.endpoint_count,
      // Backend now provides these computed fields
      status: workspace.status || 'unknown',
      uptime: workspace.uptime,
      avgResponseTime: workspace.avg_response_time,
      lastCheck: workspace.last_check,
      activeIncidents: workspace.active_incidents || 0,
      // Legacy fields for compatibility
      createdAt: workspace.created_at,
      maxTotalEndpoints: 7 // From constants
    }
  })

  // Calculate overview statistics compatible with existing components
  const allEndpoints = transformedWorkspaces.flatMap((ws: any) => ws.endpoints)
  
  return {
    user: {
      id: backendData.user.id,
      email: backendData.user.email,
      limits: {
        maxWorkspaces: backendData.user.limits.max_workspaces,
        maxTotalEndpoints: backendData.user.limits.max_total_endpoints
      },
      current: {
        workspaceCount: backendData.user.current.workspace_count,
        totalEndpoints: backendData.user.current.total_endpoints
      },
      // Add legacy fields for compatibility
      maxWorkspaces: backendData.user.limits.max_workspaces,
      maxTotalEndpoints: backendData.user.limits.max_total_endpoints
    },
    workspaces: transformedWorkspaces,
    overview: {
      totalEndpoints: backendData.overview.total_endpoints,
      activeEndpoints: backendData.overview.active_endpoints,
      totalWorkspaces: backendData.overview.total_workspaces,
      
      // Chart data - directly use the new comprehensive data
      uptimeHistory: backendData.overview.uptimeHistory || [],
      responseTimeHistory: backendData.overview.responseTimeHistory || [],
      
      // Performance data
      bestPerformingEndpoints: backendData.overview.bestPerformingEndpoints || [],
      worstPerformingEndpoints: backendData.overview.worstPerformingEndpoints || [],
      
      // Legacy fields for existing components (computed)
      avgUptime: null, // Can be computed from uptimeHistory if needed
      activeIncidents: backendData.recentIncidents.filter((incident: DashboardIncident) => incident.status === 'ongoing').length
    },
    recentIncidents: backendData.recentIncidents || []
  }
}

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: async () => {
      const data = await dashboardAPI.getDashboardStats()
      return transformDashboardData(data)
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter than default for dashboard)
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
    refetchOnWindowFocus: true, // Refresh when user returns to tab
  })
}
