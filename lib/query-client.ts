export const queryKeys = {
  dashboard: ['dashboard'],
  workspaces: ['workspaces'],
  workspace: (id: string) => ['workspace', id],
  workspaceEndpoints: (id: string) => ['workspace', id, 'endpoints'],
  endpoint: (id: string) => ['endpoint', id],
} as const

// Utility function for invalidating related queries
export const invalidateQueries = {
  dashboard: (queryClient: any) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })
  },
  workspace: (queryClient: any, workspaceId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.workspace(workspaceId) })
    queryClient.invalidateQueries({ queryKey: queryKeys.workspaceEndpoints(workspaceId) })
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })
  },
  allWorkspaces: (queryClient: any) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.workspaces })
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })
  }
}