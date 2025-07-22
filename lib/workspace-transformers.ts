import { WorkspaceStatsResponse, WorkspaceStatsEndpoint } from '@/hooks/useWorkspaceStats'
import { EndpointData } from '@/lib/data-loader'

/**
 * Transform unified workspace stats to legacy component formats.
 * This ensures backward compatibility while using the new unified data source.
 */

// Transform for WorkspaceHeader component
export interface WorkspaceHeaderData {
  id: string
  name: string
  description: string | null
  endpointCount: number
  maxEndpoints: number
  status: 'online' | 'warning' | 'offline' | 'unknown'
  uptime: number | null
  avgResponseTime: number | null
  lastCheck: string | null
  activeIncidents: number
  createdAt: string
  endpoints: Array<{ name: string; status: string }>
}

export function transformForWorkspaceHeader(stats: WorkspaceStatsResponse): WorkspaceHeaderData {
  const { workspace, overview, health, endpoints } = stats
  
  return {
    id: workspace.id,
    name: workspace.name,
    description: workspace.description,
    endpointCount: overview.total_endpoints,
    maxEndpoints: 7, // This could come from user limits in the future
    status: health.status as any, // Map backend status to frontend
    uptime: overview.avg_uptime_24h,
    avgResponseTime: overview.avg_response_time_24h,
    lastCheck: overview.last_check_at,
    activeIncidents: health.active_incidents,
    createdAt: workspace.created_at,
    endpoints: endpoints.map(ep => ({
      name: ep.name,
      status: ep.status
    }))
  }
}

// Transform for WorkspaceChartsSection component  
export interface WorkspaceChartsData {
  id: string
  name: string
  endpointCount: number
  uptime: number | null
  avgResponseTime: number | null
  activeIncidents: number
  endpoints: any[] // Legacy format
}

export function transformForWorkspaceCharts(stats: WorkspaceStatsResponse): WorkspaceChartsData {
  const { workspace, overview, health } = stats
  
  return {
    id: workspace.id,
    name: workspace.name,
    endpointCount: overview.total_endpoints,
    uptime: overview.avg_uptime_24h,
    avgResponseTime: overview.avg_response_time_24h,
    activeIncidents: health.active_incidents,
    endpoints: [] // Not needed for charts anymore since we pass endpointStats directly
  }
}

// Transform endpoints for EndpointsTable component
export function transformForEndpointsTable(stats: WorkspaceStatsResponse): any[] {
  // Return raw endpoints for the table - it expects the original endpoint format
  return stats.endpoints.map(endpoint => ({
    id: endpoint.id,
    name: endpoint.name,
    url: endpoint.url,
    method: endpoint.method,
    is_active: endpoint.is_active,
    frequency_minutes: endpoint.frequency_minutes,
    timeout_seconds: endpoint.timeout_seconds,
    expected_status: endpoint.expected_status,
    created_at: endpoint.created_at,
    workspace_id: stats.workspace.id
  }))
}

// Transform for EndpointData (used by some legacy components)
export function transformToEndpointData(endpoint: WorkspaceStatsEndpoint): EndpointData {
  return {
    id: endpoint.id,
    name: endpoint.name,
    url: endpoint.url,
    method: endpoint.method,
    status: endpoint.status as any,
    uptime: endpoint.uptime_24h,
    responseTime: endpoint.avg_response_time_24h, // Use 24h average, not last response time
    lastCheck: endpoint.last_check_at,
    frequency: endpoint.frequency_minutes,
  }
}

// Transform monitoring stats for charts (replaces the old monitoring endpoint data)
export interface MonitoringStatsForCharts {
  id: string
  name: string
  url: string
  is_active: boolean
  last_check_at: string | null
  consecutive_failures: number
  checks_last_24h: number
  successful_checks_24h: number
  avg_response_time_24h: string | null // Keep as string for compatibility
  last_check_success: boolean | null
  last_status_code: number | null
  last_response_time: number | null
}

export function transformForMonitoringCharts(stats: WorkspaceStatsResponse): MonitoringStatsForCharts[] {
  return stats.endpoints.map(endpoint => ({
    id: endpoint.id,
    name: endpoint.name,
    url: endpoint.url,
    is_active: endpoint.is_active,
    last_check_at: endpoint.last_check_at,
    consecutive_failures: endpoint.consecutive_failures,
    checks_last_24h: endpoint.checks_last_24h,
    successful_checks_24h: endpoint.successful_checks_24h,
    avg_response_time_24h: endpoint.avg_response_time_24h?.toString() || null,
    last_check_success: endpoint.last_check_success,
    last_status_code: endpoint.last_status_code,
    last_response_time: endpoint.last_response_time
  }))
}

// Health summary stats (for WorkspaceChartsSection health display)
export interface HealthSummaryStats {
  totalChecks: number
  successfulChecks: number
  overallUptime: number | null
  avgResponseTime: number | null
  onlineEndpoints: number
  warningEndpoints: number
  offlineEndpoints: number
  unknownEndpoints: number
  activeEndpoints: number
  healthScore: number | null
  // NEW: Weather properties
  weather?: string
  weather_emoji?: string
  weather_description?: string
}

export function transformForHealthSummary(stats: WorkspaceStatsResponse): HealthSummaryStats {
  const { overview, health } = stats
  
  return {
    totalChecks: overview.total_checks_24h,
    successfulChecks: overview.successful_checks_24h,
    overallUptime: overview.avg_uptime_24h,
    avgResponseTime: overview.avg_response_time_24h,
    onlineEndpoints: overview.online_endpoints,
    warningEndpoints: overview.warning_endpoints,
    offlineEndpoints: overview.offline_endpoints,
    unknownEndpoints: overview.unknown_endpoints,
    activeEndpoints: overview.active_endpoints,
    healthScore: health.health_score,
    // NEW: Add weather properties
    weather: health.weather,
    weather_emoji: health.weather_emoji,
    weather_description: health.weather_description
  }
}

/**
 * Utility function to check if data is fresh enough.
 * Helps determine when to show loading states vs stale data.
 */
export function isDataFresh(generatedAt: string, maxAgeSeconds: number = 60): boolean {
  const generated = new Date(generatedAt)
  const now = new Date()
  const ageSeconds = (now.getTime() - generated.getTime()) / 1000
  return ageSeconds <= maxAgeSeconds
}

/**
 * Get a human-readable data freshness indicator.
 */
export function getDataFreshnessText(generatedAt: string): string {
  const generated = new Date(generatedAt)
  const now = new Date()
  const ageSeconds = (now.getTime() - generated.getTime()) / 1000
  
  if (ageSeconds < 30) return 'Just now'
  if (ageSeconds < 60) return `${Math.floor(ageSeconds)}s ago`
  if (ageSeconds < 3600) return `${Math.floor(ageSeconds / 60)}m ago`
  return `${Math.floor(ageSeconds / 3600)}h ago`
}
