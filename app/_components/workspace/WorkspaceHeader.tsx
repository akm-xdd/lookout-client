// components/workspace/WorkspaceHeader.tsx - FIXED VERSION
import React from 'react'
import { ArrowLeft, Settings, Plus, Play, MoreVertical, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { formatLastCheck, formatCreatedAt } from '@/lib/data-loader'

interface WorkspaceHeaderProps {
  workspace: {
    id: string
    name: string
    description: string
    endpointCount: number
    maxEndpoints: number
    status: 'online' | 'warning' | 'offline'
    uptime: number
    avgResponseTime: number
    lastCheck: string
    activeIncidents: number
    createdAt: string
    endpoints: Array<{ name: string; status: 'online' | 'warning' | 'offline' | string }>
  }
  onRefresh?: () => void
  onAddEndpoint?: () => void
}

const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({ 
  workspace, 
  onRefresh, 
  onAddEndpoint 
}) => {
  const router = useRouter()
  
  // Add safety checks for undefined properties
  const endpointCount = workspace.endpointCount ?? 0
  const maxEndpoints = workspace.maxEndpoints ?? 7
  const endpoints = workspace.endpoints ?? []
  const uptime = workspace.uptime ?? 100
  const avgResponseTime = workspace.avgResponseTime ?? 0
  
  const hasEndpoints = endpointCount > 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400 bg-green-400/20 border-green-400/30'
      case 'warning': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30'
      case 'offline': return 'text-red-400 bg-red-400/20 border-red-400/30'
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return '●'
      case 'warning': return '⚠'
      case 'offline': return '●'
      default: return '○'
    }
  }

  const handleBack = () => {
    router.push('/dashboard')
  }

  const handleAddEndpoint = () => {
    if (onAddEndpoint) {
      onAddEndpoint()
    } else {
      toast.info('Coming soon!', {
        description: 'Add endpoint functionality is being built',
        duration: 3000,
      })
    }
  }

  const handleTestAll = () => {
    if (!hasEndpoints) {
      toast.info('No endpoints to test', {
        description: 'Add some endpoints first',
        duration: 3000,
      })
      return
    }
    toast.info('Testing all endpoints...', {
      description: 'This feature is being built',
      duration: 3000,
    })
  }

  const handleSettings = () => {
    toast.info('Coming soon!', {
      description: 'Workspace settings is being built',
      duration: 3000,
    })
  }

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh()
      toast.success('Refreshed workspace data')
    }
  }

  return (
    <div className="mb-8">
      {/* Back Navigation */}
      <button
        onClick={handleBack}
        className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      {/* Workspace Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-2">
            <h1 className="text-3xl font-bold">{workspace.name}</h1>
            {hasEndpoints && (
              <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(workspace.status)}`}>
                <span className="mr-1">{getStatusIcon(workspace.status)}</span>
                {workspace.status}
              </div>
            )}
          </div>

          <p className="text-gray-400 text-lg mb-4">
            {workspace.description || 'No description provided'}
          </p>

          {/* Quick Stats */}
          <div className="flex items-center space-x-6 text-sm">
            <div>
              <span className="text-gray-400">Endpoints: </span>
              <span className="text-white font-medium">
                {endpointCount}/{maxEndpoints}
              </span>
            </div>

            {hasEndpoints ? (
              <>
                <div>
                  <span className="text-gray-400">Uptime: </span>
                  <span className={`font-medium ${uptime >= 99 ? 'text-green-400' : uptime >= 95 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {uptime.toFixed(1)}%
                  </span>
                </div>

                <div>
                  <span className="text-gray-400">Avg Response: </span>
                  <span className={`font-medium ${avgResponseTime < 500 ? 'text-green-400' : avgResponseTime < 1000 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {avgResponseTime}ms
                  </span>
                </div>

                <div>
                  <span className="text-gray-400">Last Check: </span>
                  <span className="text-white font-medium">
                    {formatLastCheck(workspace.lastCheck)}
                  </span>
                </div>
              </>
            ) : (
              <div>
                <span className="text-gray-400">Created: </span>
                <span className="text-white font-medium">
                  {formatCreatedAt(workspace.createdAt)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
            title="Refresh data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleTestAll}
            disabled={!hasEndpoints}
            title={hasEndpoints ? 'Test all endpoints' : 'No endpoints to test'}
            className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4" />
            <span>Test All</span>
          </button>

          <button
            onClick={handleAddEndpoint}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Endpoint</span>
          </button>

          <button
            onClick={handleSettings}
            className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
            title="Workspace settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
            title="More options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Endpoint Status Overview */}
      {hasEndpoints ? (
        <div className="flex items-center space-x-4">
          <span className="text-gray-400 text-sm">Endpoints:</span>
          <div className="flex items-center space-x-1">
            {endpoints?.slice(0, 7).map((endpoint, i) => (
              <div
                key={endpoint.id || i}
                className={`w-3 h-3 rounded-full ${
                  endpoint.status === 'online' ? 'bg-green-400' :
                  endpoint.status === 'warning' ? 'bg-yellow-400' :
                  endpoint.status === 'offline' ? 'bg-red-400' : 'bg-gray-400'
                }`}
                title={`${endpoint.name}: ${endpoint.status}`}
              />
            ))}
            {endpointCount < maxEndpoints && (
              <button
                onClick={handleAddEndpoint}
                className="w-3 h-3 border-2 border-dashed border-gray-500 rounded-full hover:border-blue-400 transition-colors"
                title="Add endpoint"
              />
            )}
          </div>
          <span className="text-gray-500 text-xs">
            {endpoints.filter(e => e.status === 'online').length} online,{' '}
            {endpoints.filter(e => e.status === 'warning').length} warning,{' '}
            {endpoints.filter(e => e.status === 'offline').length} offline
          </span>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <span className="text-gray-400 text-sm">No endpoints configured</span>
          <button
            onClick={handleAddEndpoint}
            className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
          >
            Add your first endpoint →
          </button>
        </div>
      )}
    </div>
  )
}

export default WorkspaceHeader