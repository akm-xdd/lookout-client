// lib/api-client.ts - Enhanced with token refresh handling
import { supabase } from './supabase'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'APIError'
  }
}

// Token refresh state management
let refreshPromise: Promise<string> | null = null

async function getValidToken(): Promise<string> {
  // If a refresh is already in progress, wait for it
  if (refreshPromise) {
    return refreshPromise
  }

  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  
  if (sessionError || !session?.access_token) {
    throw new APIError(401, 'No authentication token available')
  }

  // Check if token expires soon (within 60 seconds)
  const expiresAt = session.expires_at * 1000
  const expiresIn = expiresAt - Date.now()
  
  if (expiresIn < 60000) { // Less than 1 minute
    // Start refresh process
    refreshPromise = refreshToken()
    
    try {
      const newToken = await refreshPromise
      refreshPromise = null
      return newToken
    } catch (error) {
      refreshPromise = null
      throw error
    }
  }

  return session.access_token
}

async function refreshToken(): Promise<string> {
  console.log('🔄 Refreshing token proactively...')
  
  const { data, error } = await supabase.auth.refreshSession()
  
  if (error || !data.session?.access_token) {
    console.error('❌ Token refresh failed:', error)
    throw new APIError(401, 'Token refresh failed')
  }

  console.log('✅ Token refreshed successfully')
  return data.session.access_token
}

async function apiCall(endpoint: string, options: RequestInit = {}, retryCount = 0): Promise<any> {
  const maxRetries = 1 // Only retry once to avoid loops
  
  try {
    // Get a valid token (with proactive refresh)
    const token = await getValidToken()

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `HTTP ${response.status}`
      
      try {
        const errorJson = JSON.parse(errorText)
        errorMessage = errorJson.detail || errorMessage
      } catch {
        errorMessage = errorText || errorMessage
      }

      // Handle 401 errors with retry logic
      if (response.status === 401 && retryCount < maxRetries) {
        console.log('🔄 401 error, attempting token refresh and retry...')
        
        // Force a token refresh
        refreshPromise = refreshToken()
        
        try {
          await refreshPromise
          refreshPromise = null
          
          // Retry the original request
          return apiCall(endpoint, options, retryCount + 1)
        } catch (refreshError) {
          refreshPromise = null
          console.error('❌ Retry failed after token refresh:', refreshError)
          throw new APIError(401, 'Authentication failed after retry')
        }
      }
      
      throw new APIError(response.status, errorMessage)
    }

    // Handle empty responses (like DELETE)
    if (response.status === 204) {
      return null
    }

    return await response.json()
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    throw new APIError(500, error instanceof Error ? error.message : 'Unknown error')
  }
}

// Enhanced auth context integration
export function enhanceAuthContext() {
  // Listen for token refresh events to clear any cached state
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'TOKEN_REFRESHED') {
      console.log('🔄 Token refreshed by Supabase')
      // Clear any refresh promise since Supabase handled it
      refreshPromise = null
    } else if (event === 'SIGNED_OUT') {
      // Clear refresh promise on sign out
      refreshPromise = null
    }
  })
}

// Initialize enhanced auth handling
enhanceAuthContext()

// Workspace API methods (unchanged)
export const workspaceAPI = {
  async getWorkspaces() {
    return apiCall('/api/workspaces')
  },

  async createWorkspace(data: { name: string; description?: string }) {
    return apiCall('/api/workspaces', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  async getWorkspace(workspaceId: string) {
    return apiCall(`/api/workspaces/${workspaceId}`)
  },

  async updateWorkspace(workspaceId: string, data: { name?: string; description?: string }) {
    return apiCall(`/api/workspaces/${workspaceId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  async deleteWorkspace(workspaceId: string) {
    return apiCall(`/api/workspaces/${workspaceId}`, {
      method: 'DELETE'
    })
  },

  async getWorkspaceStats(workspaceId: string) {
    return apiCall(`/api/workspaces/${workspaceId}/stats`)
  }
}

export const endpointAPI = {
  async getWorkspaceEndpoints(workspaceId: string) {
    return apiCall(`/api/workspaces/${workspaceId}/endpoints`)
  },

  async createEndpoint(workspaceId: string, data: any) {
    return apiCall(`/api/workspaces/${workspaceId}/endpoints`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  async updateEndpoint(workspaceId: string, endpointId: string, data: any) {
    return apiCall(`/api/workspaces/${workspaceId}/endpoints/${endpointId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  async deleteEndpoint(workspaceId: string, endpointId: string) {
    return apiCall(`/api/workspaces/${workspaceId}/endpoints/${endpointId}`, {
      method: 'DELETE'
    })
  },

  async testEndpoint(workspaceId: string, endpointId: string) {
    return apiCall(`/api/workspaces/${workspaceId}/endpoints/${endpointId}/test`, {
      method: 'POST'
    })
  }
}

export const dashboardAPI = {
  async getDashboardStats() {
    return apiCall('/api/dashboard')
  },

  async getDashboardChartStats() {
    return apiCall('/api/dashboard/stats')
  }
}

export const userAPI = {
  async deleteAccount(data: { email: string; password?: string; confirmText?: string }) {
    return apiCall('/api/user/account', {
      method: 'DELETE',
      body: JSON.stringify(data)
    })
  }
}

export { APIError }