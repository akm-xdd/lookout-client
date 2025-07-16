// app/workspace/[id]/page.tsx - MINIMAL FIXES
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
  uptime: number | null
  responseTime: number | null
  lastCheck: string | null
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
  status: 'online' | 'warning' | 'offline' | 'unknown'
  uptime: number | null
  avgResponseTime: number | null
  lastCheck: string | null
  activeIncidents: number
  endpoints: EndpointData[]
}

export default function WorkspaceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const workspaceId = params.id as string
  
  const [workspace, setWorkspace] = useState<WorkspaceDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addEndpointModalOpen, setAddEndpointModalOpen] = useState(false)


  // In workspace page, add this temporarily:
useEffect(() => {
  const handleFocus = () => console.log('🔍 Tab gained focus')
  const handleBlur = () => console.log('😴 Tab lost focus') 
  const handleVisibility = () => console.log('👁️ Visibility changed:', document.visibilityState)
  
  window.addEventListener('focus', handleFocus)
  window.addEventListener('blur', handleBlur)
  document.addEventListener('visibilitychange', handleVisibility)
  
  return () => {
    window.removeEventListener('focus', handleFocus)
    window.removeEventListener('blur', handleBlur)
    document.removeEventListener('visibilitychange', handleVisibility)
  }
}, [])

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
      
      // Transform endpoints data with null handling
      const transformedEndpoints: EndpointData[] = (endpointsData || []).map((endpoint: any) => ({
        id: endpoint.id,
        name: endpoint.name,
        url: endpoint.url,
        method: endpoint.method,
        status: endpoint.is_active ? 'unknown' : 'offline', // Show unknown until we have real monitoring data
        uptime: null, // Will be calculated from check results when available
        responseTime: null, // Will come from last check when available
        lastCheck: null, // Will come from actual monitoring checks
        frequency: endpoint.frequency_minutes
      }))
      
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
      
      // Transform API data to UI format
      const transformedWorkspace: WorkspaceDetailData = {
        ...workspaceData,
        endpointCount: transformedEndpoints.length,
        maxEndpoints: 7,
        status: workspaceStatus,
        uptime: avgUptime,
        avgResponseTime: avgResponseTime,
        lastCheck: lastCheck,
        activeIncidents: offlineEndpoints, // Only count confirmed offline endpoints
        endpoints: transformedEndpoints
      }
      
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

  const handleAddEndpoint = () => {
    setAddEndpointModalOpen(true)
  }

  const handleEndpointAdded = () => {
    setAddEndpointModalOpen(false)
    loadWorkspaceData() // Refresh data
    toast.success('Endpoint added successfully!')
  }

  const handleEndpointDeleted = () => {
    loadWorkspaceData() // Refresh data
    toast.success('Endpoint deleted successfully!')
  }

  useEffect(() => {
    loadWorkspaceData()
  }, [loadWorkspaceData])

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-900 relative overflow-hidden">
          <AnimatedBackground />
          <div className="relative z-10 container mx-auto px-6 py-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Loading workspace...</p>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-900 relative overflow-hidden">
          <AnimatedBackground />
          <div className="relative z-10 container mx-auto px-6 py-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="text-6xl mb-4">😞</div>
                <h2 className="text-2xl font-bold text-white mb-2">Oops!</h2>
                <p className="text-gray-400 mb-6">{error}</p>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!workspace) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-900 relative overflow-hidden">
          <AnimatedBackground />
          <div className="relative z-10 container mx-auto px-6 py-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="text-6xl mb-4">🤷‍♂️</div>
                <h2 className="text-2xl font-bold text-white mb-2">Workspace Not Found</h2>
                <p className="text-gray-400 mb-6">The workspace you're looking for doesn't exist.</p>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 relative overflow-hidden">
        <AnimatedBackground />
        
        <div className="relative z-10 container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Workspace Header */}
            <WorkspaceHeader
              workspace={{
                ...workspace,
                createdAt: workspace.created_at
              }}
              onRefresh={loadWorkspaceData}
              onAddEndpoint={handleAddEndpoint}
            />

            {/* Main Content */}
            <div className="space-y-8">
              {/* Endpoints Table */}
              <EndpointsTable
                endpoints={workspace.endpoints}
                workspaceId={workspaceId}
                onEndpointDeleted={handleEndpointDeleted}
                onAddEndpoint={handleAddEndpoint}
              />

              {/* Charts Section */}
              <WorkspaceChartsSection 
                workspaceData={workspace}
              />
            </div>
          </motion.div>
        </div>

        {/* Add Endpoint Modal */}
        {addEndpointModalOpen && (
          <EndpointFormModal
            workspaceId={workspaceId}
            isOpen={addEndpointModalOpen}
            onClose={() => setAddEndpointModalOpen(false)}
            onSuccess={handleEndpointAdded}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}