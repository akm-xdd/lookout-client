// lib/data-loader.ts
export interface EndpointData {
  id: string
  name: string
  url: string
  method: string
  status: 'online' | 'warning' | 'offline' | 'unknown'
  uptime: number
  responseTime: number
  avgResponseTime: number
  lastCheck: string
  frequency: number
  timeout: number
  expectedStatus: number
  incidentCount: number
  checksToday: number
}

export interface WorkspaceData {
  id: string
  name: string
  description: string
  createdAt: string
  endpointCount: number
  maxEndpoints: number
  status: 'online' | 'warning' | 'offline'
  uptime: number
  avgResponseTime: number
  lastCheck: string
  activeIncidents: number
  endpoints: EndpointData[]
}

export interface IncidentData {
  id: string
  endpointId: string
  endpointName: string
  workspaceName: string
  status: 'ongoing' | 'resolved'
  startTime: string
  endTime: string | null
  duration: number
  cause: string
  responseCode: number
}

export interface OverviewData {
  overallUptime: number
  activeIncidents: number
  avgResponseTime: number
  totalChecksToday: number
  uptimeHistory: Array<{ date: string; uptime: number }>
  responseTimeHistory: Array<{ timestamp: string; avgResponseTime: number }>
}

export interface UserData {
  id: string
  email: string
  workspaceCount: number
  maxWorkspaces: number
  totalEndpoints: number
  maxEndpoints: number
}

export interface DashboardData {
  user: UserData
  overview: OverviewData
  workspaces: WorkspaceData[]
  recentIncidents: IncidentData[]
}

// Default empty data structure
const getEmptyDashboardData = (): DashboardData => ({
  user: {
    id: '',
    email: '',
    workspaceCount: 0,
    maxWorkspaces: 5,
    totalEndpoints: 0,
    maxEndpoints: 35
  },
  overview: {
    overallUptime: 0,
    activeIncidents: 0,
    avgResponseTime: 0,
    totalChecksToday: 0,
    uptimeHistory: [],
    responseTimeHistory: []
  },
  workspaces: [],
  recentIncidents: []
})

// Load dashboard data from file or return empty data
export const loadDashboardData = async (): Promise<DashboardData> => {
  try {
    // In a real app, this would be an API call
    // For now, we'll try to load from a local file
    const response = await fetch('/data/dashboard-sample.json')
    
    if (!response.ok) {
      console.log('Sample data file not found, using empty data')
      return getEmptyDashboardData()
    }
    
    const data = await response.json()
    console.log('✅ Loaded sample dashboard data:', {
      workspaces: data.workspaces?.length || 0,
      totalEndpoints: data.user?.totalEndpoints || 0
    })
    
    return data
  } catch (error) {
    console.log('📝 No sample data found, using empty state:', error)
    return getEmptyDashboardData()
  }
}

// Utility functions for data analysis
export const getDashboardStats = (data: DashboardData) => {
  const { workspaces, overview } = data
  
  return {
    totalWorkspaces: workspaces.length,
    totalEndpoints: workspaces.reduce((sum, ws) => sum + ws.endpointCount, 0),
    onlineEndpoints: workspaces.reduce((sum, ws) => 
      sum + ws.endpoints.filter(ep => ep.status === 'online').length, 0
    ),
    warningEndpoints: workspaces.reduce((sum, ws) => 
      sum + ws.endpoints.filter(ep => ep.status === 'warning').length, 0
    ),
    offlineEndpoints: workspaces.reduce((sum, ws) => 
      sum + ws.endpoints.filter(ep => ep.status === 'offline').length, 0
    ),
    avgUptime: overview.overallUptime,
    avgResponseTime: overview.avgResponseTime,
    activeIncidents: overview.activeIncidents
  }
}

export const getWorkspaceStatusIcon = (status: string) => {
  switch (status) {
    case 'online': return '🟢'
    case 'warning': return '🟡'
    case 'offline': return '🔴'
    default: return '⚪'
  }
}

export const formatUptime = (uptime: number): string => {
  return `${uptime.toFixed(1)}%`
}

export const formatResponseTime = (ms: number): string => {
  if (ms === 0) return 'N/A'
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

export const formatLastCheck = (timestamp: string): string => {
  const now = new Date()
  const checkTime = new Date(timestamp)
  const diffMs = now.getTime() - checkTime.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}