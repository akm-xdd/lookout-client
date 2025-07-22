// components/workspace/WorkspaceHeader.tsx - ENHANCED WITH EDIT/DELETE
import React, { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Settings, Plus, Play, MoreVertical, RefreshCw, Edit, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { formatLastCheck, formatCreatedAt, formatUptime, formatResponseTime } from '@/lib/data-loader'

interface WorkspaceHeaderProps {
  workspace: {
    id: string
    name: string
    description: string
    endpointCount: number
    maxEndpoints: number
    status: 'online' | 'warning' | 'offline' | 'unknown'
    uptime: number | null
    avgResponseTime: number | null
    lastCheck: string | null
    activeIncidents: number
    createdAt: string
    endpoints: Array<{ name: string; status: 'online' | 'warning' | 'offline' | string }>
  }
  onRefresh?: () => void
  onAddEndpoint?: () => void
  onEditWorkspace?: () => void
  onDeleteWorkspace?: () => void
}

const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({ 
  workspace, 
  onRefresh, 
  onAddEndpoint,
  onEditWorkspace,
  onDeleteWorkspace
}) => {
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Add safety checks for undefined properties
  const endpointCount = workspace.endpointCount ?? 0
  const maxEndpoints = workspace.maxEndpoints ?? 7
  const endpoints = workspace.endpoints ?? []
  const uptime = workspace.uptime
  const avgResponseTime = workspace.avgResponseTime
  
  const hasEndpoints = endpointCount > 0
  const hasData = hasEndpoints && uptime !== null && avgResponseTime !== null

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400 bg-green-400/20 border-green-400/30'
      case 'operational': return 'text-green-400 bg-green-400/20 border-green-400/30'
      case 'warning': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30'
      case 'offline': return 'text-red-400 bg-red-400/20 border-red-400/30'
      case 'unknown': return 'text-gray-400 bg-gray-400/20 border-gray-400/30'
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return '●'
      case 'operational': return '●'
      case 'warning': return '⚠'
      case 'offline': return '●'
      case 'unknown': return '○'
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


  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh()
      toast.success('Refreshed workspace data')
    }
  }

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleEditWorkspace = () => {
    setIsDropdownOpen(false)
    if (onEditWorkspace) {
      onEditWorkspace()
    } else {
      toast.info('Coming soon!', {
        description: 'Edit workspace functionality is being built',
        duration: 3000,
      })
    }
  }

  const handleDeleteWorkspace = () => {
    setIsDropdownOpen(false)
    if (onDeleteWorkspace) {
      onDeleteWorkspace()
    } else {
      toast.info('Coming soon!', {
        description: 'Delete workspace functionality is being built',
        duration: 3000,
      })
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

            {hasData ? (
              <>
                <div>
                  <span className="text-gray-400">Uptime: </span>
                  <span className={`font-medium ${uptime! >= 99 ? 'text-green-400' : uptime! >= 95 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {formatUptime(uptime)}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400">Avg Response: </span>
                  <span className={`font-medium ${avgResponseTime! < 500 ? 'text-green-400' : avgResponseTime! < 1000 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {formatResponseTime(avgResponseTime)}
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
            onClick={handleAddEndpoint}
            className="flex items-center space-x-2 p-2 bg-green-500/20 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add Endpoint</span>
          </button>

          {/* Workspace Settings Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleDropdownToggle}
              className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
              title="Workspace settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-white/10 rounded-lg shadow-lg z-50">
                <div className="py-2">
                  {/* Edit Workspace */}
                  <button
                    onClick={handleEditWorkspace}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Workspace</span>
                  </button>

                  {/* Divider */}
                  <div className="border-t border-white/10 my-1" />

                  {/* Delete Workspace */}
                  <button
                    onClick={handleDeleteWorkspace}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Workspace</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkspaceHeader