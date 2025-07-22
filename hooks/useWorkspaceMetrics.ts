import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { workspaceAPI } from '@/lib/api-client'

// Type definitions based on backend schema
export interface WorkspaceStatsEndpoint {
  id: string
  name: string
  url: string
  method: string
  is_active: boolean
  frequency_minutes: number
  timeout_seconds: number
  expected_status: number
  created_at: string
  
  // 24-hour monitoring statistics
  status: 'online' | 'warning' | 'offline' | 'unknown' | 'inactive'
  uptime_24h: number | null
  avg_response_time_24h: number | null
  checks_last_24h: number
  successful_checks_24h: number
  consecutive_failures: number
  
  // Latest check information
  last_check_at: string | null
  last_check_success: boolean | null
  last_response_time: number | null
  last_status_code: number | null
  last_error_message: string | null
}

export interface WorkspaceStatsOverview {
  total_endpoints: number
  active_endpoints: number
  online_endpoints: number
  warning_endpoints: number
  offline_endpoints: number
  unknown_endpoints: number
  avg_uptime_24h: number | null
  avg_response_time_24h: number | null
  total_checks_24h: number
  successful_checks_24h: number
  last_check_at: string | null
}

export interface WorkspaceStatsHealth {
  status: 'operational' | 'warning' | 'degraded' | 'critical' | 'unknown'
  health_score: number | null
  active_incidents: number
  last_incident_at: string | null
  weather: string
  weather_emoji: string
  weather_description: string
  uptime_trend_7d: any[]
  response_time_trend_24h: any[]
}

export interface WorkspaceStatsWorkspace {
  id: string
  name: string
  description: string | null
  user_id: string
  created_at: string
  updated_at: string
}

export interface WorkspaceStatsIncident {
  endpoint_id: string
  endpoint_name: string
  status: 'ongoing' | 'resolved'
  cause: string
  duration_minutes: number
  failure_count: number
  status_code: number
  start_time: string
  end_time: string | null
  detected_at: string
}

export interface WorkspaceStatsResponse {
  workspace: WorkspaceStatsWorkspace
  endpoints: WorkspaceStatsEndpoint[]
  overview: WorkspaceStatsOverview
  health: WorkspaceStatsHealth
  recent_incidents: WorkspaceStatsIncident[]  // ADD THIS
  generated_at: string
  data_window_hours: number
}

/**
 * Unified hook for workspace statistics.
 * 
 * Replaces the previous 3 separate hooks:
 * - useWorkspace()
 * - useWorkspaceEndpoints() 
 * - useWorkspaceMonitoring()
 * 
 * Provides all data needed for the workspace page in a single optimized call.
 * 
 * Features:
 * - Tanstack Query caching and background updates
 * - 30-second refresh interval for real-time monitoring
 * - Automatic error handling and retry logic
 * - Optimistic updates and cache invalidation
 */
export function useWorkspaceStats(
  workspaceId: string,
  options?: {
    enabled?: boolean
    refetchInterval?: number
    staleTime?: number
  }
): UseQueryResult<WorkspaceStatsResponse, Error> {
  const {
    enabled = true,
    refetchInterval = 30000, // 30 seconds
    staleTime = 25000, // 25 seconds (slightly less than refetch)
  } = options || {}

  return useQuery({
    queryKey: ['workspace-stats', workspaceId],
    queryFn: () => workspaceAPI.getWorkspaceStats(workspaceId),
    enabled: enabled && !!workspaceId,
    refetchInterval,
    staleTime,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    
    // Cache management
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes after component unmount
    
    // Error handling
    throwOnError: false, // Let components handle errors gracefully
    
    // Background updates
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
  })
}

/**
 * Hook for manual refresh with optimistic loading state.
 * Use this for refresh buttons.
 */
export function useRefreshWorkspaceStats(workspaceId: string) {
  const { refetch, isFetching } = useWorkspaceStats(workspaceId, { enabled: false })
  
  const refresh = async () => {
    console.log(`🔄 Manual refresh triggered for workspace ${workspaceId}`)
    return await refetch()
  }
  
  return {
    refresh,
    isRefreshing: isFetching
  }
}

/**
 * Lightweight hook that only returns loading/error states.
 * Useful for components that just need to know if data is loading.
 */
export function useWorkspaceStatsStatus(workspaceId: string) {
  const { isLoading, isError, error, isFetching } = useWorkspaceStats(workspaceId)
  
  return {
    isLoading,
    isError,
    error,
    isFetching,
    isRefreshing: isFetching && !isLoading
  }
}
