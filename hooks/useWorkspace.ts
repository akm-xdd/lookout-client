import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { workspaceAPI, endpointAPI } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-client'

// Get single workspace data
export const useWorkspace = (workspaceId: string) => {
  return useQuery({
    queryKey: queryKeys.workspace(workspaceId),
    queryFn: () => workspaceAPI.getWorkspace(workspaceId),
    enabled: !!workspaceId,
  })
}

// Get workspace endpoints
export const useWorkspaceEndpoints = (workspaceId: string) => {
  return useQuery({
    queryKey: queryKeys.workspaceEndpoints(workspaceId),
    queryFn: () => endpointAPI.getWorkspaceEndpoints(workspaceId),
    enabled: !!workspaceId,
  })
}