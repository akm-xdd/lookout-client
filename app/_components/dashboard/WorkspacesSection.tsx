import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import WorkspaceCard from './WorkspaceCard'
import CreateWorkspaceModal from '../workspace/CreateWorkspaceModal'
import { DashboardData } from '@/lib/data-loader'

interface WorkspacesSectionProps {
  data: DashboardData
  loading?: boolean
  onRefresh?: () => void // New prop to trigger data refresh
}

const WorkspacesSection: React.FC<WorkspacesSectionProps> = ({ 
  data, 
  loading = false,
  onRefresh 
}) => {
  const router = useRouter()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const handleWorkspaceClick = (workspaceId: string) => {
    router.push(`/workspace/${workspaceId}`)
  }

  const handleCreateWorkspace = () => {
    setIsCreateModalOpen(true)
  }

  const handleModalSuccess = () => {
    // Trigger data refresh when workspace is created
    if (onRefresh) {
      onRefresh()
    }
  }

  if (loading) {
    return <WorkspacesSectionLoading />
  }

  // Empty state
  if (data.workspaces.length === 0) {
    return (
      <>
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Workspaces</h2>
            <button 
              onClick={handleCreateWorkspace}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Create Workspace</span>
            </button>
          </div>

          {/* Empty State */}
          <div className="text-center py-12 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No workspaces yet</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Create your first workspace to start monitoring your projects. Each workspace can contain up to 7 endpoints.
            </p>
            <button 
              onClick={handleCreateWorkspace}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First Workspace</span>
            </button>
          </div>
        </div>

        {/* Create Workspace Modal */}
        <CreateWorkspaceModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleModalSuccess}
        />
      </>
    )
  }

  // Loaded state with workspaces
  return (
    <>
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Your Workspaces</h2>
          {data.workspaces.length < data.user.maxWorkspaces && (
            <button 
              onClick={handleCreateWorkspace}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Create Workspace</span>
            </button>
          )}
        </div>

        {/* Workspaces Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.workspaces.map((workspace) => (
            <WorkspaceCard
              key={workspace.id}
              workspace={workspace}
              onClick={() => handleWorkspaceClick(workspace.id)}
            />
          ))}
          
          {/* Add New Card (if space available) */}
          {data.workspaces.length < data.user.maxWorkspaces && (
            <div 
              onClick={handleCreateWorkspace}
              className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 border-dashed p-6 flex flex-col items-center justify-center text-center hover:bg-white/8 transition-all cursor-pointer min-h-[240px]"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Create Workspace</h3>
              <p className="text-gray-400 text-sm">
                Add a new project to monitor
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Workspace Modal */}
      <CreateWorkspaceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </>
  )
}

// Loading skeleton component (same as before)
const WorkspacesSectionLoading: React.FC = () => {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 bg-white/10 rounded w-40 animate-pulse"></div>
        <div className="h-10 bg-white/10 rounded w-36 animate-pulse"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i}
            className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 min-h-[240px]"
          >
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-white/10 rounded w-32"></div>
                <div className="h-4 w-4 bg-white/10 rounded"></div>
              </div>
              <div className="h-4 bg-white/10 rounded w-full mb-2"></div>
              <div className="h-4 bg-white/10 rounded w-3/4 mb-4"></div>
              <div className="flex space-x-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="w-2 h-2 bg-white/10 rounded-full"></div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j}>
                    <div className="h-3 bg-white/10 rounded w-16 mb-1"></div>
                    <div className="h-4 bg-white/10 rounded w-12"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WorkspacesSection