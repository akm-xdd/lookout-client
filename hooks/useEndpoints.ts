import { useMutation, useQueryClient } from '@tanstack/react-query'
import { endpointAPI } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-client'

export const useCreateEndpoint = (workspaceId: string) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: any) => endpointAPI.createEndpoint(workspaceId, data),
    onSuccess: () => {
      // Invalidate workspace endpoints and dashboard
      queryClient.invalidateQueries({ queryKey: queryKeys.workspaceEndpoints(workspaceId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })
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
      queryClient.invalidateQueries({ queryKey: queryKeys.workspaceEndpoints(workspaceId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })
    },
  })
}