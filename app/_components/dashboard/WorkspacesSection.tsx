// components/dashboard/WorkspacesSection.tsx - WITH DELETE FUNCTIONALITY
import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import WorkspaceCard from './WorkspaceCard'
import CreateWorkspaceModal from '../workspace/CreateWorkspaceModal'
import EditWorkspaceModal from '../workspace/EditWorkspaceModal'
import DeleteWorkspaceModal from '../workspace/DeleteWorkspaceModal'
import { DashboardData } from '@/lib/data-loader'
import { cacheInvalidation } from '@/lib/data-loader'


interface WorkspacesSectionProps {
  data: DashboardData
  loading?: boolean
  onRefresh?: () => void
}

const WorkspacesSection: React.FC<WorkspacesSectionProps> = ({ 
  data, 
  loading = false,
  onRefresh 
}) => {
  const router = useRouter()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [workspaceToEdit, setWorkspaceToEdit] = useState<{
    id: string
    name: string
    description?: string
  } | null>(null)
  const [workspaceToDelete, setWorkspaceToDelete] = useState<{
    id: string
    name: string
    description?: string
    endpointCount: number
  } | null>(null)

  const handleWorkspaceClick = (workspaceId: string) => {
    router.push(`/workspace/${workspaceId}`)
  }

  const handleCreateWorkspace = () => {
    setIsCreateModalOpen(true)
  }

const handleCreateSuccess = () => {
  setIsCreateModalOpen(false)
  // Invalidate cache before triggering refresh
  cacheInvalidation.onWorkspaceChange()
  // Trigger data refresh when workspace is created
  if (onRefresh) {
    onRefresh()
  }
}

  const handleEditWorkspace = (workspace: any) => {
    setWorkspaceToEdit({
      id: workspace.id,
      name: workspace.name,
      description: workspace.description
    })
    setIsEditModalOpen(true)
  }

const handleEditSuccess = () => {
  setIsEditModalOpen(false)
  setWorkspaceToEdit(null)
  // Invalidate cache for the specific workspace
  if (workspaceToEdit?.id) {
    cacheInvalidation.onWorkspaceChange(workspaceToEdit.id)
  }
  // Trigger data refresh when workspace is edited
  if (onRefresh) {
    onRefresh()
  }
}


  const handleEditClose = () => {
    setIsEditModalOpen(false)
    setWorkspaceToEdit(null)
  }

  const handleDeleteWorkspace = (workspace: any) => {
    setWorkspaceToDelete({
      id: workspace.id,
      name: workspace.name,
      description: workspace.description,
      endpointCount: workspace.endpointCount
    })
    setIsDeleteModalOpen(true)
  }

const handleDeleteSuccess = () => {
  setIsDeleteModalOpen(false)
  // Invalidate cache for the deleted workspace
  if (workspaceToDelete?.id) {
    cacheInvalidation.onWorkspaceChange(workspaceToDelete.id)
  }
  setWorkspaceToDelete(null)
  // Trigger data refresh when workspace is deleted
  if (onRefresh) {
    onRefresh()
  }
}

  const handleDeleteClose = () => {
    setIsDeleteModalOpen(false)
    setWorkspaceToDelete(null)
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

          {/* Create Workspace Modal */}
          <CreateWorkspaceModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSuccess={handleCreateSuccess}
          />
        </div>
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

        {/* Usage Info */}
        <p className="text-gray-400 text-sm mb-6">
          {data.workspaces.length} of {data.user.maxWorkspaces} workspaces used • {data.overview.totalEndpoints} of {data.user.maxEndpoints} total endpoints
        </p>

        {/* Workspaces Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.workspaces.map((workspace) => (
            <WorkspaceCard
              key={workspace.id}
              workspace={{
                ...workspace,
                createdAt: workspace.created_at
              }}
              onClick={() => handleWorkspaceClick(workspace.id)}
              onEdit={() => handleEditWorkspace(workspace)}
              onDelete={() => handleDeleteWorkspace(workspace)}
            />
          ))}
        </div>

        {/* Create Workspace Modal */}
        <CreateWorkspaceModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />

        {/* Edit Workspace Modal */}
        <EditWorkspaceModal
          isOpen={isEditModalOpen}
          onClose={handleEditClose}
          onSuccess={handleEditSuccess}
          workspace={workspaceToEdit}
        />

        {/* Delete Workspace Modal */}
        <DeleteWorkspaceModal
          isOpen={isDeleteModalOpen}
          onClose={handleDeleteClose}
          onSuccess={handleDeleteSuccess}
          workspace={workspaceToDelete}
        />
      </div>
    </>
  )
}

// Loading skeleton component
const WorkspacesSectionLoading: React.FC = () => {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 bg-white/10 rounded w-48 animate-pulse"></div>
        <div className="h-10 bg-white/10 rounded w-40 animate-pulse"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white/5 rounded-xl border border-white/10 p-6">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-white/10 rounded w-32"></div>
                <div className="h-4 w-4 bg-white/10 rounded"></div>
              </div>
              <div className="h-16 bg-white/10 rounded mb-4"></div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="h-8 bg-white/10 rounded"></div>
                <div className="h-8 bg-white/10 rounded"></div>
                <div className="h-8 bg-white/10 rounded"></div>
              </div>
              <div className="h-4 bg-white/10 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WorkspacesSection