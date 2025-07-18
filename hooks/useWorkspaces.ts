import { useMutation, useQueryClient } from '@tanstack/react-query'
import { workspaceAPI } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-client'

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: workspaceAPI.createWorkspace,
    onSuccess: () => {
      // Auto-refresh dashboard data when workspace is created
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })
    },
  })
}

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ workspaceId, data }: { workspaceId: string, data: any }) => 
      workspaceAPI.updateWorkspace(workspaceId, data),
    onSuccess: () => {
      // Auto-refresh dashboard data when workspace is updated
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })
    },
  })
}

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: workspaceAPI.deleteWorkspace,
    onMutate: async (workspaceId) => {
      // Optimistic update - immediately remove from UI
      await queryClient.cancelQueries({ queryKey: queryKeys.dashboard })
      
      const previousData = queryClient.getQueryData(queryKeys.dashboard)
      
      // Optimistically remove the workspace from the dashboard data
      queryClient.setQueryData(queryKeys.dashboard, (old: any) => {
        if (!old) return old
        return {
          ...old,
          workspaces: old.workspaces.filter((ws: any) => ws.id !== workspaceId)
        }
      })
      
      return { previousData }
    },
    onError: (err, workspaceId, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(queryKeys.dashboard, context.previousData)
      }
    },
    onSettled: () => {
      // Always refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })
    },
  })
}