// lib/data-loader.ts - FIXED VERSION
import { workspaceAPI, endpointAPI, APIError, dashboardAPI } from './api-client'

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

// Transform raw API endpoint data to UI format
function transformEndpointData(endpoint: any): EndpointData {
  return {
    id: endpoint.id,
    name: endpoint.name,
    url: endpoint.url,
    method: endpoint.method,
    status: endpoint.is_active ? 'unknown' : 'offline', // Show unknown until we have real monitoring data
    uptime: null, // Will be calculated from check results when available
    responseTime: null, // Will come from last check when available
    lastCheck: null, // Will come from actual monitoring checks
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
    
    // Calculate workspace stats based on actual data
    const endpointsWithData = transformedEndpoints.filter(e => e.uptime !== null)
    const onlineEndpoints = transformedEndpoints.filter(e => e.status === 'online').length
    const warningEndpoints = transformedEndpoints.filter(e => e.status === 'warning').length
    const offlineEndpoints = transformedEndpoints.filter(e => e.status === 'offline').length
    const unknownEndpoints = transformedEndpoints.filter(e => e.status === 'unknown').length
    
    // Determine workspace status
    let workspaceStatus: 'online' | 'warning' | 'offline' | 'unknown' = 'unknown'
    if (transformedEndpoints.length === 0) {
      workspaceStatus = 'unknown' // No endpoints to monitor
    } else if (offlineEndpoints > 0) {
      workspaceStatus = 'offline'
    } else if (warningEndpoints > 0) {
      workspaceStatus = 'warning'
    } else if (onlineEndpoints > 0) {
      workspaceStatus = 'online'
    } else {
      workspaceStatus = 'unknown' // All endpoints are unknown status
    }
    
    // Calculate uptime only if we have real data
    const uptimeValues = transformedEndpoints.filter(e => e.uptime !== null).map(e => e.uptime!)
    const avgUptime = uptimeValues.length > 0 ? 
      uptimeValues.reduce((sum, uptime) => sum + uptime, 0) / uptimeValues.length : null
    
    // Calculate response time only if we have real data
    const responseTimeValues = transformedEndpoints.filter(e => e.responseTime !== null).map(e => e.responseTime!)
    const avgResponseTime = responseTimeValues.length > 0 ?
      responseTimeValues.reduce((sum, time) => sum + time, 0) / responseTimeValues.length : null
    
    // Get most recent check time if available
    const checkTimes = transformedEndpoints.filter(e => e.lastCheck !== null).map(e => e.lastCheck!)
    const lastCheck = checkTimes.length > 0 ?
      checkTimes.reduce((latest, current) => 
        new Date(current) > new Date(latest) ? current : latest
      ) : null
    
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
      status: workspaceStatus,
      uptime: avgUptime,
      avgResponseTime: avgResponseTime,
      lastCheck: lastCheck,
      activeIncidents: offlineEndpoints, // Only count confirmed offline endpoints
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
      // Computed fields with safe defaults
      endpointCount: 0,
      maxEndpoints: 7,
      status: 'unknown',
      uptime: null,
      avgResponseTime: null,
      lastCheck: null,
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
  
  // Calculate average uptime only from endpoints with real data
  const endpointsWithUptime = allEndpoints.filter(e => e.uptime !== null)
  const avgUptime = endpointsWithUptime.length > 0 ? 
    endpointsWithUptime.reduce((sum, e) => sum + e.uptime!, 0) / endpointsWithUptime.length : null
  
  // Calculate average response time only from endpoints with real data
  const endpointsWithResponseTime = allEndpoints.filter(e => e.responseTime !== null)
  const avgResponseTime = endpointsWithResponseTime.length > 0 ?
    endpointsWithResponseTime.reduce((sum, e) => sum + e.responseTime!, 0) / endpointsWithResponseTime.length : null
  
  const activeIncidents = allEndpoints.filter(e => e.status === 'offline').length
  
  // TODO: Replace with real historical data from API
  const uptimeHistory: Array<{date: string, uptime: number}> = []
  const responseTimeHistory: Array<{timestamp: string, avgResponseTime: number}> = []
  
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
    console.log('📊 Loading dashboard data from new endpoint...')
    
    // Single API call to new dashboard endpoint
    const dashboardResponse = await dashboardAPI.getDashboard()
    
    console.log('✅ Dashboard data loaded:', dashboardResponse)
    
    // Transform the backend response to frontend format
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
  } catch (error) {
    console.error('❌ Failed to load dashboard data:', error)
    throw error
  }
}
// Utility functions for formatting - UPDATED to handle null values
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

// Calculate dashboard stats helper - UPDATED to handle null values
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