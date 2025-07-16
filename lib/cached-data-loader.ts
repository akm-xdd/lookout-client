import { cacheManager, cacheKeys } from './cache-manager'
import { loadDashboardData, DashboardData } from './data-loader'
import { workspaceAPI, endpointAPI } from './api-client'

/**
 * Cached version of loadDashboardData
 * TTL: 5 minutes (default)
 */
export async function loadDashboardDataCached(): Promise<DashboardData> {
  return cacheManager.get(
    cacheKeys.dashboard(),
    () => loadDashboardData()
  )
}

/**
 * Cached version of workspace data loading
 * TTL: 5 minutes (default)
 */
export async function loadWorkspaceDataCached(workspaceId: string) {
  const [workspaceData, endpointsData] = await Promise.all([
    // Cache workspace data
    cacheManager.get(
      cacheKeys.workspace(workspaceId),
      () => workspaceAPI.getWorkspace(workspaceId)
    ),
    
    // Cache endpoints data
    cacheManager.get(
      cacheKeys.workspaceEndpoints(workspaceId),
      () => endpointAPI.getWorkspaceEndpoints(workspaceId)
    )
  ])

  return { workspaceData, endpointsData }
}

/**
 * Force refresh specific data (clears cache first)
 */
export async function refreshDashboardData(): Promise<DashboardData> {
  cacheManager.invalidate(cacheKeys.dashboard())
  return loadDashboardDataCached()
}

/**
 * Force refresh workspace data (clears cache first)
 */
export async function refreshWorkspaceData(workspaceId: string) {
  cacheManager.invalidatePattern(cacheKeys.workspacePattern(workspaceId))
  return loadWorkspaceDataCached(workspaceId)
}