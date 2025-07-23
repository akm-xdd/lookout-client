import { useMutation, useQueryClient } from '@tanstack/react-query'
import { endpointAPI } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-client'

export const useCreateEndpoint = (workspaceId: string) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: any) => endpointAPI.createEndpoint(workspaceId, data),
    onSuccess: () => {
      // Invalidate workspace endpoints and dashboard
      queryClient.invalidateQueries({ queryKey: ['workspace-stats', workspaceId]  })
      queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId, 'endpoints'] })
      queryClient.invalidateQueries({ 
        queryKey: ['dashboard'] 
      })
    },
  })
}

export const useDeleteEndpoint = (workspaceId: string) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (endpointId: string) => endpointAPI.deleteEndpoint(workspaceId, endpointId),
    onMutate: async (endpointId) => {
      // Optimistic update - immediately remove from UI
      await queryClient.cancelQueries({ queryKey: queryKeys.workspaceEndpoints(workspaceId) })
      
      const previousEndpoints = queryClient.getQueryData(queryKeys.workspaceEndpoints(workspaceId))
      
      // Remove the endpoint from cache immediately
      queryClient.setQueryData(queryKeys.workspaceEndpoints(workspaceId), (old: any[]) =>
        old?.filter(endpoint => endpoint.id !== endpointId) ?? []
      )
      
      return { previousEndpoints }
    },
    onError: (err, endpointId, context) => {
      // Rollback on error
      if (context?.previousEndpoints) {
        queryClient.setQueryData(queryKeys.workspaceEndpoints(workspaceId), context.previousEndpoints)
      }
    },
    onSettled: () => {
      // Always refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['workspace-stats', workspaceId] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId, 'endpoints'] })
    },
  })
}

// Update endpoint (general purpose)
export const useUpdateEndpoint = (workspaceId: string) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ endpointId, data }: {
      endpointId: string
      data: {
        name?: string
        url?: string
        method?: string
        headers?: Record<string, string>
        body?: string
        expected_status?: number
        frequency_minutes?: number
        timeout_seconds?: number
        is_active?: boolean
      }
    }) => endpointAPI.updateEndpoint(workspaceId, endpointId, data),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['workspace-stats', workspaceId] })
      queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId, 'endpoints'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    }
  })
}

// Toggle endpoint active status (specific use case)
export function useToggleEndpoint(workspaceId: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ endpointId, isActive }: { endpointId: string, isActive: boolean }) => 
      endpointAPI.updateEndpoint(workspaceId, endpointId, { is_active: isActive }),
    onSuccess: () => {
      // CRITICAL FIX: Invalidate workspace stats query (correct key!)
      queryClient.invalidateQueries({ 
        queryKey: ['workspace-stats', workspaceId] 
      })
      
      // Also invalidate endpoints list if it exists
      queryClient.invalidateQueries({ 
        queryKey: ['workspace', workspaceId, 'endpoints'] 
      })
    }
  })
    }

export function useTestEndpoint(workspaceId: string) {
  return useMutation({
    mutationFn: (endpointId: string) => endpointAPI.testEndpoint(workspaceId, endpointId),
    // No cache invalidation needed since we don't persist test results
  })
}