export interface WorkspaceData {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
  user_id: string
  // Computed fields for UI
  endpointCount: number
  maxEndpoints: number
  status: 'online' | 'warning' | 'offline' | 'unknown'
  uptime: number | null
  avgResponseTime: number | null
  lastCheck: string | null
  activeIncidents: number
  endpoints: EndpointData[]
}

export interface EndpointData {
  id: string
  name: string
  url: string
  method: string
  status: 'online' | 'warning' | 'offline' | 'unknown'
  uptime: number | null
  responseTime: number | null
  lastCheck: string | null
  frequency: number
}

export interface UserData {
  id: string
  email: string
  maxWorkspaces: number
  maxEndpoints: number
}

export interface OverviewData {
  totalEndpoints: number
  activeEndpoints: number
  avgUptime: number | null
  avgResponseTime: number | null
  activeIncidents: number
  uptimeHistory: Array<{
    date: string
    uptime: number
  }>
  responseTimeHistory: Array<{
    timestamp: string
    avgResponseTime: number
  }>
}

export interface IncidentData {
  id: string
  endpointName: string
  workspaceName: string
  status: 'ongoing' | 'resolved'
  cause: string
  duration: number
  responseCode: number
  startTime: string
  endTime?: string
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
    return `${responseTime}ms`
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

// KEEP: Dashboard stats helper (used by components)
export function getDashboardStats(data: DashboardData) {
  const allEndpoints = data.workspaces.flatMap(ws => ws.endpoints || [])
  
  return {
    totalWorkspaces: data.workspaces.length,
    totalEndpoints: allEndpoints.length,
    onlineEndpoints: allEndpoints.filter(e => e.status === 'online').length,
    warningEndpoints: allEndpoints.filter(e => e.status === 'warning').length,
    offlineEndpoints: allEndpoints.filter(e => e.status === 'offline').length,
    unknownEndpoints: allEndpoints.filter(e => e.status === 'unknown').length,
    avgUptime: data.overview.avgUptime,
    activeIncidents: data.overview.activeIncidents
  }
}