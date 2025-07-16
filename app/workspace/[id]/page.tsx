'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'motion/react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import ProtectedRoute from '@/app/auth/ProtectedRoute'
import AnimatedBackground from '@/app/_components/layout/AnimatedBackground'
import WorkspaceHeader from '@/app/_components/workspace/WorkspaceHeader'
import EndpointsTable from '@/app/_components/workspace/EndpointsTable'
import WorkspaceChartsSection from '@/app/_components/workspace/WorkspaceChartsSection'
import EndpointFormModal from '@/app/_components/workspace/EndpointFormModal'
import { loadDashboardData, DashboardData, WorkspaceData } from '@/lib/data-loader'
import { useRouter } from 'next/navigation'
import { workspaceAPI, endpointAPI, APIError } from '@/lib/api-client'
import { RefreshCw } from 'lucide-react'

interface EndpointData {
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

interface WorkspaceDetailData {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
  user_id: string
  // Add computed fields for UI
  endpointCount: number
  maxEndpoints: number
  status: 'online' | 'warning' | 'offline'
  uptime: number
  avgResponseTime: number
  lastCheck: string
  activeIncidents: number
  endpoints: EndpointData[]
}

// Create a safe default workspace object
const createDefaultWorkspace = (workspaceData: any): WorkspaceDetailData => ({
  id: workspaceData?.id || '',
  name: workspaceData?.name || 'Unknown Workspace',
  description: workspaceData?.description || '',
  created_at: workspaceData?.created_at || new Date().toISOString(),
  updated_at: workspaceData?.updated_at || new Date().toISOString(),
  user_id: workspaceData?.user_id || '',
  endpointCount: 0,
  maxEndpoints: 7,
  status: 'online',
  uptime: 100,
  avgResponseTime: 0,
  lastCheck: new Date().toISOString(),
  activeIncidents: 0,
  endpoints: []
})

export default function WorkspaceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const workspaceId = params.id as string
  
  const [workspace, setWorkspace] = useState<WorkspaceDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addEndpointModalOpen, setAddEndpointModalOpen] = useState(false)

  const loadWorkspaceData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get workspace data from API
      const [workspaceData, endpointsData] = await Promise.all([
        workspaceAPI.getWorkspace(workspaceId),
        endpointAPI.getWorkspaceEndpoints(workspaceId)
      ])
      
      if (!workspaceData) {
        setError('Workspace not found')
        return
      }
      
      // Transform endpoints data with safety checks
      const transformedEndpoints: EndpointData[] = (endpointsData || []).map((endpoint: any) => ({
        id: endpoint.id || '',
        name: endpoint.name || 'Unknown Endpoint',
        url: endpoint.url || '',
        method: endpoint.method || 'GET',
        status: (endpoint.is_active ? 'online' : 'offline') as 'online' | 'offline', // TODO: get real status from monitoring
        uptime: 100, // TODO: calculate from check results
        responseTime: 0, // TODO: get from last check
        lastCheck: endpoint.created_at || new Date().toISOString(), // TODO: get from last check
        frequency: endpoint.frequency_minutes || 5
      }))
      
      // Calculate workspace stats with safety checks
      const onlineEndpoints = transformedEndpoints.filter(e => e.status === 'online').length
      const warningEndpoints = transformedEndpoints.filter(e => e.status === 'warning').length
      const offlineEndpoints = transformedEndpoints.filter(e => e.status === 'offline').length
      
      let workspaceStatus: 'online' | 'warning' | 'offline' = 'online'
      if (offlineEndpoints > 0) workspaceStatus = 'offline'
      else if (warningEndpoints > 0) workspaceStatus = 'warning'
      
      // Transform API data to UI format with all required fields
      const transformedWorkspace: WorkspaceDetailData = {
        ...createDefaultWorkspace(workspaceData), // Start with safe defaults
        ...workspaceData, // Override with actual data
        // Always ensure computed fields are properly set
        endpointCount: transformedEndpoints.length,
        maxEndpoints: 7,
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
      
      console.log('✅ Workspace data loaded:', {
        name: transformedWorkspace.name,
        endpointCount: transformedWorkspace.endpointCount,
        hasEndpoints: transformedWorkspace.endpoints.length > 0
      })
      
      setWorkspace(transformedWorkspace)
      
    } catch (err) {
      console.error('Failed to load workspace:', err)
      
      if (err instanceof APIError) {
        if (err.status === 404) {
          setError('Workspace not found')
        } else if (err.status === 401) {
          setError('Authentication required. Please log in again.')
        } else {
          setError(`Failed to load workspace: ${err.message}`)
        }
      } else {
        setError('Failed to load workspace. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }, [workspaceId])

  useEffect(() => {
    loadWorkspaceData()
  }, [loadWorkspaceData])

  const handleRefresh = () => {
    loadWorkspaceData()
  }

  const handleAddEndpoint = () => {
    setAddEndpointModalOpen(true)
  }

  const handleEndpointAdded = () => {
    loadWorkspaceData() // Refresh data after adding endpoint
  }

  const handleEndpointDeleted = () => {
    loadWorkspaceData() // Refresh data after deleting endpoint
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-black text-white overflow-hidden">
          <AnimatedBackground particleCount={15} />
          
          <div className="relative z-10 px-6 py-12">
            <div className="max-w-7xl mx-auto">
              {/* Loading State */}
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex items-center space-x-3">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
                  <span className="text-lg text-gray-300">Loading workspace...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error || !workspace) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-black text-white overflow-hidden">
          <AnimatedBackground particleCount={15} />
          
          <div className="relative z-10 px-6 py-12">
            <div className="max-w-7xl mx-auto">
              {/* Error State */}
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="text-red-400 text-6xl mb-4">⚠</div>
                  <h2 className="text-2xl font-bold mb-2">{error || 'Workspace not found'}</h2>
                  <p className="text-gray-400 mb-6">
                    {error?.includes('Authentication') 
                      ? 'Please log in again to continue.' 
                      : 'The workspace you\'re looking for might have been deleted or you don\'t have access to it.'
                    }
                  </p>
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() => router.push('/dashboard')}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                    >
                      Back to Dashboard
                    </button>
                    <button
                      onClick={handleRefresh}
                      className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  // Success state - render workspace details
  return (
    <ProtectedRoute>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-black text-white overflow-hidden"
      >
        <AnimatedBackground particleCount={15} />
        
        <div className="relative z-10 px-6 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Workspace Header */}
            <WorkspaceHeader 
              workspace={{
                ...workspace,
                createdAt: workspace.created_at,
                endpoints: workspace.endpoints.map(e => ({
                  name: e.name,
                  status: e.status
                }))
              }}
              onRefresh={handleRefresh}
              onAddEndpoint={handleAddEndpoint}
            />

            {/* Main Content */}
            <div className="space-y-8">
              {/* Charts Section - Only show if we have endpoints */}
              {workspace.endpointCount > 0 && (
                <WorkspaceChartsSection 
                  workspaceData={{
                    ...workspace,
                    // Transform for charts component
                    endpointData: workspace.endpoints
                  }}
                />
              )}

              {/* Endpoints Table */}
              <EndpointsTable
                endpoints={workspace.endpoints}
                workspaceId={workspaceId}
                onEndpointDeleted={handleEndpointDeleted}
                onAddEndpoint={handleAddEndpoint}
              />
            </div>
          </div>
        </div>

        {/* Add Endpoint Modal */}
        <EndpointFormModal
          isOpen={addEndpointModalOpen}
          onClose={() => setAddEndpointModalOpen(false)}
          onSuccess={handleEndpointAdded}
          workspaceId={workspaceId}
          maxEndpoints={workspace.maxEndpoints}
          currentEndpoints={workspace.endpointCount}
        />
      </motion.div>
    </ProtectedRoute>
  )
}