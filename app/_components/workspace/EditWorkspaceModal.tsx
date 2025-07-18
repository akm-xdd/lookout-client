import React, { useState, useEffect } from 'react'
import { X, Edit, Save } from 'lucide-react'
import { toast } from 'sonner'
import { useUpdateWorkspace } from '@/hooks/useWorkspaces' // NEW

interface EditWorkspaceModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  workspace: {
    id: string
    name: string
    description?: string
  } | null
}

const EditWorkspaceModal: React.FC<EditWorkspaceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  workspace
}) => {
  // REPLACE: Manual API call with mutation hook
  const updateWorkspace = useUpdateWorkspace()
  
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  // Populate form when workspace changes
  useEffect(() => {
    if (workspace) {
      setFormData({
        name: workspace.name,
        description: workspace.description || ''
      })
    }
  }, [workspace])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!workspace) return

    // Validation
    if (!formData.name.trim()) {
      toast.error('Workspace name is required')
      return
    }

    if (formData.name.trim().length < 2) {
      toast.error('Workspace name must be at least 2 characters')
      return
    }

    if (formData.name.trim().length > 50) {
      toast.error('Workspace name must be less than 50 characters')
      return
    }

    // Check if anything actually changed
    const hasChanges = 
      formData.name.trim() !== workspace.name ||
      formData.description.trim() !== (workspace.description || '')

    if (!hasChanges) {
      toast.info('No changes to save')
      onClose()
      return
    }

    try {
      const updateData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined
      }

      await updateWorkspace.mutateAsync({
        workspaceId: workspace.id,
        data: updateData
      })
      
      toast.success('Workspace updated', {
        description: `"${updateData.name}" has been saved`,
        duration: 3000,
      })
      
      onClose()
      onSuccess()
      
    } catch (error: any) {
      console.error('Update workspace error:', error)
      
      toast.error('Failed to update workspace', {
        description: error?.message || 'Unknown error',
        duration: 4000,
      })
    }
  }

  const handleClose = () => {
    if (!updateWorkspace.isPending) { // CHANGED: Use isPending
      // Reset form to original values
      if (workspace) {
        setFormData({
          name: workspace.name,
          description: workspace.description || ''
        })
      }
      onClose()
    }
  }

  const handleInputChange = (field: 'name' | 'description', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (!isOpen || !workspace) return null

  // Check if form has changes for button state
  const hasChanges = 
    formData.name.trim() !== workspace.name ||
    formData.description.trim() !== (workspace.description || '')

  const isFormValid = formData.name.trim().length >= 2 && formData.name.trim().length <= 50

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
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Edit className="w-4 h-4 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold">Edit Workspace</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={updateWorkspace.isPending} // CHANGED: Use isPending
            className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            {/* Workspace Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Workspace Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter workspace name"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/50"
                disabled={updateWorkspace.isPending} // CHANGED: Use isPending
                maxLength={50}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">
                  {formData.name.trim().length < 2 && formData.name.length > 0 ? 
                    'At least 2 characters required' : 
                    ''}
                </span>
                <span className="text-xs text-gray-500">
                  {formData.name.length}/50
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Description <span className="text-gray-500">(optional)</span>
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what this workspace is for..."
                rows={3}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/50 resize-none"
                disabled={updateWorkspace.isPending} // CHANGED: Use isPending
                maxLength={200}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">
                  Optional description for your workspace
                </span>
                <span className="text-xs text-gray-500">
                  {formData.description.length}/200
                </span>
              </div>
            </div>
          </div>
         
          {/* Actions */}
          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={updateWorkspace.isPending} // CHANGED: Use isPending
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateWorkspace.isPending || !isFormValid || !hasChanges} // CHANGED: Use isPending
              className="flex items-center space-x-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateWorkspace.isPending ? ( // CHANGED: Use isPending
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditWorkspaceModal