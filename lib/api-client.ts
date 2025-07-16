// lib/api-client.ts
import { supabase } from './supabase'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'APIError'
  }
}

async function apiCall(endpoint: string, options: RequestInit = {}) {
  try {
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session?.access_token) {
      throw new APIError(401, 'No authentication token available')
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
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

// Workspace API methods
export const workspaceAPI = {
  // Get all workspaces
  async getWorkspaces() {
    return apiCall('/api/workspaces')
  },

  // Create workspace
  async createWorkspace(data: { name: string; description?: string }) {
    return apiCall('/api/workspaces', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  // Get single workspace
  async getWorkspace(workspaceId: string) {
    return apiCall(`/api/workspaces/${workspaceId}`)
  },

  // Update workspace
  async updateWorkspace(workspaceId: string, data: { name?: string; description?: string }) {
    return apiCall(`/api/workspaces/${workspaceId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  // Delete workspace
  async deleteWorkspace(workspaceId: string) {
    return apiCall(`/api/workspaces/${workspaceId}`, {
      method: 'DELETE'
    })
  }
}

// Endpoint API methods
export const endpointAPI = {
  // Get all endpoints for a workspace
  async getWorkspaceEndpoints(workspaceId: string) {
    return apiCall(`/api/workspaces/${workspaceId}/endpoints`)
  },

  // Create endpoint
  async createEndpoint(workspaceId: string, data: {
    name: string
    url: string
    method?: string
    headers?: Record<string, string>
    body?: string
    expected_status?: number
    frequency_minutes?: number
    timeout_seconds?: number
    is_active?: boolean
  }) {
    return apiCall(`/api/workspaces/${workspaceId}/endpoints`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  // Get single endpoint
  async getEndpoint(workspaceId: string, endpointId: string) {
    return apiCall(`/api/workspaces/${workspaceId}/endpoints/${endpointId}`)
  },

  // Update endpoint
  async updateEndpoint(workspaceId: string, endpointId: string, data: {
    name?: string
    url?: string
    method?: string
    headers?: Record<string, string>
    body?: string
    expected_status?: number
    frequency_minutes?: number
    timeout_seconds?: number
    is_active?: boolean
  }) {
    return apiCall(`/api/workspaces/${workspaceId}/endpoints/${endpointId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  // Delete endpoint
  async deleteEndpoint(workspaceId: string, endpointId: string) {
    return apiCall(`/api/workspaces/${workspaceId}/endpoints/${endpointId}`, {
      method: 'DELETE'
    })
  }
}

// Health check
export const healthAPI = {
  async check() {
    return fetch(`${API_BASE}/health`).then(res => res.json())
  }
}

export { APIError }