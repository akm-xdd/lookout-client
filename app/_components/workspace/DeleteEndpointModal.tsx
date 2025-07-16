import React, { useState } from 'react'
import { X, Trash2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { endpointAPI, APIError } from '@/lib/api-client'

interface DeleteEndpointModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  endpoint: {
    id: string
    name: string
    url: string
    method: string
  } | null
  workspaceId: string
}

const DeleteEndpointModal: React.FC<DeleteEndpointModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  endpoint,
  workspaceId
}) => {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!endpoint) return

    setLoading(true)
    
    try {
      // DELETE returns null on success (204 status), which is expected
      await endpointAPI.deleteEndpoint(workspaceId, endpoint.id)
      
      toast.success('Endpoint deleted', {
        description: `"${endpoint.name}" has been removed from monitoring`,
        duration: 3000,
      })
      
      onClose()
      onSuccess()
      
    } catch (error) {
      console.error('Delete endpoint error:', error)
      
      if (error instanceof APIError) {
        toast.error('Failed to delete endpoint', {
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
      onClose()
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-500/20 text-green-400'
      case 'POST': return 'bg-blue-500/20 text-blue-400'
      case 'PUT': return 'bg-yellow-500/20 text-yellow-400'
      case 'DELETE': return 'bg-red-500/20 text-red-400'
      case 'PATCH': return 'bg-purple-500/20 text-purple-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  if (!isOpen || !endpoint) return null

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
            <h2 className="text-xl font-bold">Delete Endpoint</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-300 mb-4">
            Are you sure you want to delete this endpoint? This action cannot be undone.
          </p>
          
          {/* Endpoint Info */}
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-white">{endpoint.name}</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(endpoint.method)}`}>
                {endpoint.method}
              </span>
            </div>
            <p className="text-sm text-gray-400 break-all">{endpoint.url}</p>
          </div>

          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-300">
                <p className="font-medium mb-1">This will permanently:</p>
                <ul className="list-disc list-inside space-y-1 text-red-400">
                  <li>Stop monitoring this endpoint</li>
                  <li>Remove all historical data</li>
                  <li>Cancel any active alerts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete Endpoint</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteEndpointModal