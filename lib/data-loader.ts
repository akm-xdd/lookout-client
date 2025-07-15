import { workspaceAPI, APIError } from './api-client'

// Keep existing interfaces
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

// API Workspace interface
interface APIWorkspace {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
  user_id: string
}

// Load dashboard data from FastAPI ONLY
export const loadDashboardData = async (): Promise<DashboardData> => {
  try {
    console.log('🔄 Loading dashboard data from API...')
    
    // Get real workspaces from FastAPI
    const realWorkspaces = await workspaceAPI.getWorkspaces() as APIWorkspace[]
    console.log('✅ Real workspaces loaded:', realWorkspaces.length)
    
    // Transform API workspaces to frontend format
    const transformedWorkspaces: WorkspaceData[] = realWorkspaces.map((workspace: APIWorkspace) => ({
      id: workspace.id,
      name: workspace.name,
      description: workspace.description || '',
      createdAt: workspace.created_at,
      endpointCount: 0, // TODO: Get from endpoints API
      maxEndpoints: 7,
      status: 'online' as const, // TODO: Calculate from endpoints
      uptime: 100, // TODO: Calculate from check results
      avgResponseTime: 0, // TODO: Calculate from check results
      lastCheck: new Date().toISOString(), // TODO: Get from last check
      activeIncidents: 0, // TODO: Calculate from incidents
      endpoints: [] // TODO: Get from endpoints API
    }))
    
    return {
      user: {
        id: '', // Will be set from auth
        email: '', // Will be set from auth
        workspaceCount: realWorkspaces.length,
        maxWorkspaces: 5,
        totalEndpoints: 0, // TODO: Sum from all endpoints
        maxEndpoints: 35
      },
      overview: {
        overallUptime: realWorkspaces.length > 0 ? 100 : 0, // TODO: Calculate from all endpoints
        activeIncidents: 0, // TODO: Count from incidents
        avgResponseTime: 0, // TODO: Calculate from all check results
        totalChecksToday: 0, // TODO: Count from today's checks
        uptimeHistory: [], // TODO: Generate from check results
        responseTimeHistory: [] // TODO: Generate from check results
      },
      workspaces: transformedWorkspaces,
      recentIncidents: [] // TODO: Get from incidents API
    }
    
  } catch (error) {
    if (error instanceof APIError) {
      console.error('❌ API Error:', error.message)
      if (error.status === 401) {
        throw new Error('Authentication required. Please log in again.')
      }
      throw new Error(`API Error: ${error.message}`)
    }
    
    console.error('❌ Failed to load dashboard data:', error)
    throw new Error('Failed to load dashboard data')
  }
}

// Utility functions (keep existing)
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