// app/workspace/[id]/page.tsx
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
import { loadDashboardData, DashboardData, WorkspaceData } from '@/lib/data-loader'
import { useRouter } from 'next/navigation'
import { workspaceAPI } from '@/lib/api-client'

interface EndpointData {
  id: string
  name: string
  status: 'online' | 'warning' | 'offline' | 'unknown'
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

export default function WorkspaceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const workspaceId = params.id as string
  
  const [workspace, setWorkspace] = useState<WorkspaceDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadWorkspaceData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get workspace data from API
      const workspaceData = await workspaceAPI.getWorkspace(workspaceId)
      
      if (!workspaceData) {
        setError('Workspace not found')
        return
      }
      
      // Transform API data to UI format
      const transformedWorkspace: WorkspaceDetailData = {
        ...workspaceData,
        // Add computed UI fields (TODO: get from endpoints/monitoring APIs)
        endpointCount: 0,
        maxEndpoints: 7,
        status: 'online' as const,
        uptime: 100,
        avgResponseTime: 0,
        lastCheck: new Date().toISOString(),
        activeIncidents: 0,
        endpoints: [] // TODO: Load from endpoints API
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
        setError('Failed to load workspace data')
      }
      
      toast.error('Failed to load workspace', {
        description: err instanceof Error ? err.message : 'Unknown error',
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }, [workspaceId])

  useEffect(() => {
    if (workspaceId) {
      loadWorkspaceData()
    }
  }, [workspaceId, loadWorkspaceData])

  const handleRetry = () => {
    loadWorkspaceData()
  }

  const handleGoBack = () => {
    router.push('/dashboard')
  }

  // Error state
  if (error && !loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-black text-white">
          <AnimatedBackground particleCount={15} />
          
          <main className="relative z-10 px-6 py-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center py-20">
                <div className="text-6xl mb-4">
                  {error === 'Workspace not found' ? '🔍' : '⚠️'}
                </div>
                <h1 className="text-3xl font-bold mb-4">
                  {error === 'Workspace not found' ? 'Workspace Not Found' : 'Unable to Load Workspace'}
                </h1>
                <p className="text-gray-400 mb-8">
                  {error}
                </p>
                <div className="space-y-4">
                  {error !== 'Workspace not found' && (
                    <button
                      onClick={handleRetry}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all mx-auto"
                    >
                      <RefreshCw className="w-5 h-5" />
                      <span>Retry</span>
                    </button>
                  )}
                  <button
                    onClick={handleGoBack}
                    className="block px-6 py-3 text-gray-400 hover:text-white transition-colors mx-auto"
                  >
                    ← Back to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  // Loading state
  if (loading) {
    return <WorkspaceDetailLoading />
  }

  // Success state
  if (!workspace) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-black text-white">
          <AnimatedBackground particleCount={15} />
          <main className="relative z-10 px-6 py-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center py-20">
                <h1 className="text-4xl font-bold mb-4">Workspace Not Found</h1>
                <button
                  onClick={handleGoBack}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen bg-black text-white"
      >
        <AnimatedBackground particleCount={15} />
        
        {/* Main Content */}
        <main className="relative z-10 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Workspace Header */}
            <WorkspaceHeader workspace={workspace} onRefresh={loadWorkspaceData} />
            
            {/* Endpoints Table */}
            <EndpointsTable endpoints={workspace.endpoints} className="mb-8" />
            
            {/* Charts Section */}
            <WorkspaceChartsSection workspace={workspace} />
            
          </div>
        </main>
      </motion.div>
    </ProtectedRoute>
  )
}

// Loading component
const WorkspaceDetailLoading: React.FC = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white">
        <AnimatedBackground particleCount={15} />
        
        <main className="relative z-10 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Header Skeleton */}
            <div className="mb-8">
              <div className="h-4 bg-white/10 rounded w-32 mb-6 animate-pulse"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="h-8 bg-white/10 rounded w-64 mb-2 animate-pulse"></div>
                  <div className="h-6 bg-white/10 rounded w-96 mb-4 animate-pulse"></div>
                  <div className="flex space-x-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-4 bg-white/10 rounded w-20 animate-pulse"></div>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-10 w-24 bg-white/10 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Table Skeleton */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 mb-8">
              <div className="p-6 border-b border-white/10">
                <div className="h-6 bg-white/10 rounded w-32 mb-2 animate-pulse"></div>
                <div className="h-4 bg-white/10 rounded w-48 animate-pulse"></div>
              </div>
              <div className="p-6">
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📊</div>
                  <p>Loading endpoints...</p>
                </div>
              </div>
            </div>
            
            {/* Charts Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                  <div className="h-6 bg-white/10 rounded w-32 mb-4 animate-pulse"></div>
                  <div className="h-[200px] bg-white/10 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
            
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}