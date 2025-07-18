import React, { useState } from 'react'
import { X, Trash2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { useDeleteWorkspace } from '@/hooks/useWorkspaces' // NEW

interface DeleteWorkspaceModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  workspace: {
    id: string
    name: string
    description?: string
    endpointCount: number
  } | null
}

const DeleteWorkspaceModal: React.FC<DeleteWorkspaceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  workspace
}) => {
  // REPLACE: Manual API call with mutation hook
  const deleteWorkspace = useDeleteWorkspace()
  const [confirmationText, setConfirmationText] = useState('')

  const handleDelete = async () => {
    if (!workspace) return

    // Require exact workspace name confirmation for safety
    if (confirmationText !== workspace.name) {
      toast.error('Confirmation text does not match workspace name')
      return
    }

    try {
      await deleteWorkspace.mutateAsync(workspace.id)
      
      toast.success('Workspace deleted', {
        description: `"${workspace.name}" and all its endpoints have been removed`,
        duration: 3000,
      })
      
      onClose()
      onSuccess()
      
    } catch (error: any) {
      console.error('Delete workspace error:', error)
      
      toast.error('Failed to delete workspace', {
        description: error?.message || 'Unknown error',
        duration: 4000,
      })
    }
  }

  const handleClose = () => {
    if (!deleteWorkspace.isPending) { // CHANGED: Use isPending
      setConfirmationText('')
      onClose()
    }
  }

  if (!isOpen || !workspace) return null

  const isConfirmationValid = confirmationText === workspace.name

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-black border border-white/20 rounded-xl p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <h2 className="text-xl font-bold">Delete Workspace</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={deleteWorkspace.isPending} // CHANGED: Use isPending
            className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-300 mb-4">
            Are you sure you want to delete this workspace? This action cannot be undone.
          </p>
          
          {/* Workspace Info */}
          <div className="p-4 bg-white/5 rounded-lg border border-white/10 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-white">{workspace.name}</span>
              <span className="text-sm text-gray-400">
                {workspace.endpointCount} endpoint{workspace.endpointCount !== 1 ? 's' : ''}
              </span>
            </div>
            {workspace.description && (
              <p className="text-sm text-gray-400">{workspace.description}</p>
            )}
          </div>

          {/* Warning */}
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg mb-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-300">
                <p className="font-medium mb-1">This will permanently:</p>
                <ul className="list-disc list-inside space-y-1 text-red-400">
                  <li>Delete the workspace and all its endpoints</li>
                  <li>Stop monitoring all endpoints in this workspace</li>
                  <li>Remove all historical monitoring data</li>
                  <li>Cancel any active alerts</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">
              Type <span className="font-mono text-white bg-white/10 px-1 rounded select-none">{workspace.name} </span> to confirm:
            </label>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Enter workspace name"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/20"
              disabled={deleteWorkspace.isPending} // CHANGED: Use isPending
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={deleteWorkspace.isPending} // CHANGED: Use isPending
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteWorkspace.isPending || !isConfirmationValid} // CHANGED: Use isPending
            className="flex items-center space-x-2 px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleteWorkspace.isPending ? ( // CHANGED: Use isPending
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete Workspace</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteWorkspaceModal