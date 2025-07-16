import { workspaceAPI, endpointAPI, APIError } from './api-client'

// Core interfaces
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
  status: 'online' | 'warning' | 'offline'
  uptime: number
  avgResponseTime: number
  lastCheck: string
  activeIncidents: number
  endpoints: EndpointData[]
}

export interface EndpointData {
  id: string
  name: string
  url: string
  method: string
  status: 'online' | 'warning' | 'offline' | 'unknown'
  uptime: number
  responseTime: number
  lastCheck: string
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
  avgUptime: number
  avgResponseTime: number
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

// Transform raw API endpoint data to UI format
function transformEndpointData(endpoint: any): EndpointData {
  return {
    id: endpoint.id,
    name: endpoint.name,
    url: endpoint.url,
    method: endpoint.method,
    status: endpoint.is_active ? 'online' : 'offline', // TODO: get real status from monitoring
    uptime: 100, // TODO: calculate from check results
    responseTime: 0, // TODO: get from last check
    lastCheck: endpoint.created_at, // TODO: get from last check
    frequency: endpoint.frequency_minutes
  }
}

// Transform raw API workspace data to UI format
async function transformWorkspaceData(workspace: any): Promise<WorkspaceData> {
  try {
    // Get endpoints for this workspace
    const endpointsData = await endpointAPI.getWorkspaceEndpoints(workspace.id)
    
    // Transform endpoints data
    const transformedEndpoints: EndpointData[] = (endpointsData || []).map(transformEndpointData)
    
    // Calculate workspace stats
    const onlineEndpoints = transformedEndpoints.filter(e => e.status === 'online').length
    const warningEndpoints = transformedEndpoints.filter(e => e.status === 'warning').length
    const offlineEndpoints = transformedEndpoints.filter(e => e.status === 'offline').length
    
    let workspaceStatus: 'online' | 'warning' | 'offline' = 'online'
    if (offlineEndpoints > 0) workspaceStatus = 'offline'
    else if (warningEndpoints > 0) workspaceStatus = 'warning'
    
    return {
      id: workspace.id,
      name: workspace.name,
      description: workspace.description || '',
      created_at: workspace.created_at,
      updated_at: workspace.updated_at,
      user_id: workspace.user_id,
      // Computed fields
      endpointCount: transformedEndpoints.length,
      maxEndpoints: 7, // TODO: get from constants or API
      status: transformedEndpoints.length === 0 ? 'online' : workspaceStatus,
      uptime: transformedEndpoints.length === 0 ? 100 : 
        transformedEndpoints.reduce((sum, e) => sum + e.uptime, 0) / transformedEndpoints.length,
      avgResponseTime: transformedEndpoints.length === 0 ? 0 :
        transformedEndpoints.reduce((sum, e) => sum + e.responseTime, 0) / transformedEndpoints.length,
      lastCheck: transformedEndpoints.length === 0 ? new Date().toISOString() :
        transformedEndpoints.reduce((latest, e) => 
          new Date(e.lastCheck) > new Date(latest) ? e.lastCheck : latest, 
          transformedEndpoints[0].lastCheck
        ),
      activeIncidents: offlineEndpoints,
      endpoints: transformedEndpoints
    }
  } catch (error) {
    console.error(`Error loading endpoints for workspace ${workspace.id}:`, error)
    
    // Return workspace with empty endpoints if there's an error
    return {
      id: workspace.id,
      name: workspace.name,
      description: workspace.description || '',
      created_at: workspace.created_at,
      updated_at: workspace.updated_at,
      user_id: workspace.user_id,
      // Computed fields with defaults
      endpointCount: 0,
      maxEndpoints: 7,
      status: 'online',
      uptime: 100,
      avgResponseTime: 0,
      lastCheck: new Date().toISOString(),
      activeIncidents: 0,
      endpoints: []
    }
  }
}

// Calculate dashboard overview stats
function calculateOverviewData(workspaces: WorkspaceData[]): OverviewData {
  const allEndpoints = workspaces.flatMap(ws => ws.endpoints)
  
  const totalEndpoints = allEndpoints.length
  const activeEndpoints = allEndpoints.filter(e => e.status === 'online').length
  const avgUptime = totalEndpoints === 0 ? 100 : 
    allEndpoints.reduce((sum, e) => sum + e.uptime, 0) / totalEndpoints
  const avgResponseTime = totalEndpoints === 0 ? 0 :
    allEndpoints.reduce((sum, e) => sum + e.responseTime, 0) / totalEndpoints
  const activeIncidents = allEndpoints.filter(e => e.status === 'offline').length
  
  // TODO: Replace with real historical data from API
  const uptimeHistory = []
  const responseTimeHistory = []
  
  return {
    totalEndpoints,
    activeEndpoints,
    avgUptime,
    avgResponseTime,
    activeIncidents,
    uptimeHistory,
    responseTimeHistory
  }
}

// Main data loading function
export async function loadDashboardData(): Promise<DashboardData> {
  try {
    console.log('📊 Loading dashboard data...')
    
    // Get workspaces from API
    const workspacesResponse = await workspaceAPI.getWorkspaces()
    console.log('✅ Workspaces loaded:', workspacesResponse?.length || 0)
    
    // Transform each workspace (including loading its endpoints)
    const transformedWorkspaces: WorkspaceData[] = []
    
    if (workspacesResponse && workspacesResponse.length > 0) {
      // Process workspaces sequentially to avoid overwhelming the API
      for (const workspace of workspacesResponse) {
        console.log(`🔄 Loading endpoints for workspace: ${workspace.name}`)
        const transformedWorkspace = await transformWorkspaceData(workspace)
        transformedWorkspaces.push(transformedWorkspace)
        console.log(`✅ Workspace ${workspace.name}: ${transformedWorkspace.endpointCount} endpoints`)
      }
    }
    
    // Calculate overview stats
    const overview = calculateOverviewData(transformedWorkspaces)
    
    // User data with default limits
    const userData: UserData = {
      id: '', // Will be filled by auth context
      email: '', // Will be filled by auth context
      maxWorkspaces: 5, // TODO: get from constants or API
      maxEndpoints: 35 // TODO: get from constants or API
    }
    
    const dashboardData: DashboardData = {
      user: userData,
      workspaces: transformedWorkspaces,
      overview,
      recentIncidents: [] // TODO: Add real incidents data from API
    }
    
    console.log('✅ Dashboard data loaded successfully:', {
      workspaces: transformedWorkspaces.length,
      totalEndpoints: overview.totalEndpoints
    })
    
    return dashboardData
    
  } catch (error) {
    console.error('❌ Failed to load dashboard data:', error)
    
    if (error instanceof APIError) {
      throw new Error(`API Error: ${error.message}`)
    }
    
    throw new Error('Failed to load dashboard data. Please try again.')
  }
}

// Utility functions for formatting
export function formatUptime(uptime: number): string {
  return `${uptime.toFixed(1)}%`
}

export function formatResponseTime(responseTime: number): string {
  if (responseTime < 1000) {
    return `${responseTime}ms`
  }
  return `${(responseTime / 1000).toFixed(1)}s`
}

export function formatLastCheck(lastCheck: string): string {
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

// Calculate dashboard stats helper
export function getDashboardStats(data: DashboardData) {
  const allEndpoints = data.workspaces.flatMap(ws => ws.endpoints || [])
  
  return {
    totalWorkspaces: data.workspaces.length,
    totalEndpoints: allEndpoints.length,
    onlineEndpoints: allEndpoints.filter(e => e.status === 'online').length,
    warningEndpoints: allEndpoints.filter(e => e.status === 'warning').length,
    offlineEndpoints: allEndpoints.filter(e => e.status === 'offline').length,
    avgUptime: data.overview.avgUptime,
    activeIncidents: data.overview.activeIncidents
  }
}