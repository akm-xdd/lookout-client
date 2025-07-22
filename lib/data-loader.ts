export interface EndpointData {
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
  
  // Computed/monitoring fields
  status: 'online' | 'warning' | 'offline' | 'unknown'
  uptime?: number | null
  avgResponseTime?: number | null
  lastCheck?: string | null
}

export interface WorkspaceData {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
  user_id: string
  endpointCount: number
  endpoints: EndpointData[]
}

export interface UserData {
  id: string
  email: string
  limits: {
    maxWorkspaces: number
    maxTotalEndpoints: number
  }
  current: {
    workspaceCount: number
    totalEndpoints: number
  }
}

// NEW: Performance data for best/worst endpoints
export interface EndpointPerformance {
  endpointName: string
  workspaceName: string
  avgResponseTime: number
  uptime: number
}

export interface OverviewData {
  totalEndpoints: number
  activeEndpoints: number
  totalWorkspaces: number
  
  // NEW: Chart data from comprehensive API
  uptimeHistory: Array<{ date: string; uptime: number }>
  responseTimeHistory: Array<{ timestamp: string; avgResponseTime: number }>
  
  // NEW: Performance data
  bestPerformingEndpoints: EndpointPerformance[]
  worstPerformingEndpoints: EndpointPerformance[]
  
  // Legacy fields (still needed by some components)
  avgUptime: number | null
  activeIncidents: number
}

export interface IncidentData {
  id: string
  endpointName: string
  workspaceName: string
  status: 'ongoing' | 'resolved'
  cause: string
  duration: number // seconds
  responseCode: number
  startTime: string
  endTime: string | null
}

export interface DashboardData {
  user: UserData
  workspaces: WorkspaceData[]
  overview: OverviewData
  recentIncidents: IncidentData[]
}

// KEEP: Utility functions (used by components)
export function formatUptime(uptime: number | null): string {
  if (uptime === null || uptime === undefined) return '—'
  return `${uptime.toFixed(1)}%`
}

export function formatResponseTime(responseTime: number | null): string {
  if (responseTime === null || responseTime === undefined) return '—'
  if (responseTime < 1000) {
    return `${Math.round(responseTime)}ms`
  }
  return `${(responseTime / 1000).toFixed(1)}s`
}


export function formatLastCheck(lastCheck: string | null): string {
  if (!lastCheck) return 'Never checked'
  
  const date = new Date(lastCheck)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  return `${Math.floor(diffInMinutes / 1440)}d ago`
}

export function formatCreatedAt(createdAt: string): string {
  const date = new Date(createdAt)
  return `Created ${date.toLocaleDateString()}`
}

// NEW: Format duration for incidents
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  return `${Math.floor(seconds / 86400)}d`
}

// KEEP: Dashboard stats helper (used by components)
export function getDashboardStats(data: DashboardData) {
  const allEndpoints = data.workspaces.flatMap(ws => ws.endpoints || [])
  
  // Calculate overall uptime from workspace data
  const workspaceUptimes = data.workspaces
    .filter(ws => ws.uptime !== null && ws.uptime !== undefined)
    .map(ws => ws.uptime!)
  
  const calculatedAvgUptime = workspaceUptimes.length > 0 
    ? workspaceUptimes.reduce((sum, uptime) => sum + uptime, 0) / workspaceUptimes.length
    : null
  
  // Use calculated uptime if overview.avgUptime is null
  const finalAvgUptime = data.overview.avgUptime !== null 
    ? data.overview.avgUptime 
    : calculatedAvgUptime
  
  return {
    totalWorkspaces: data.workspaces.length,
    totalEndpoints: allEndpoints.length,
    onlineEndpoints: allEndpoints.filter(e => e.status === 'online').length,
    warningEndpoints: allEndpoints.filter(e => e.status === 'warning').length,
    offlineEndpoints: allEndpoints.filter(e => e.status === 'offline').length,
    unknownEndpoints: allEndpoints.filter(e => e.status === 'unknown').length,
    avgUptime: finalAvgUptime,
    activeIncidents: data.overview.activeIncidents
  }
}
