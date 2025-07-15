// components/workspace/CreateWorkspaceModal.tsx
import React, { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { workspaceAPI, APIError } from '@/lib/api-client'

interface CreateWorkspaceModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const CreateWorkspaceModal: React.FC<CreateWorkspaceModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      toast.error('Workspace name is required')
      return
    }

    setLoading(true)
    
    try {
      await workspaceAPI.createWorkspace({
        name: name.trim(),
        description: description.trim() || undefined
      })
      
      toast.success('Workspace created!', {
        description: `"${name}" has been created successfully`,
        duration: 3000,
      })
      
      // Reset form and close modal
      setName('')
      setDescription('')
      onClose()
      onSuccess() // Trigger data refresh
      
    } catch (error) {
      if (error instanceof APIError) {
        toast.error('Failed to create workspace', {
          description: error.message,
          duration: 4000,
        })
      } else {
        toast.error('Unexpected error', {
          description: 'Please try again',
          duration: 4000,
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setName('')
      setDescription('')
      onClose()
    }
  }

  if (!isOpen) return null

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
          <h2 className="text-xl font-bold">Create Workspace</h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Workspace Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Personal Projects, SaaS App"
              maxLength={255}
              required
              disabled={loading}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-400 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description for this workspace"
              maxLength={1000}
              rows={3}
              disabled={loading}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-400 resize-none disabled:opacity-50"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Create Workspace</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateWorkspaceModal