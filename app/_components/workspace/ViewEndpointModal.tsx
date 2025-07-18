import React from 'react'
import { X, Globe, Clock, Timer, CheckCircle, AlertCircle } from 'lucide-react'

interface ViewEndpointModalProps {
  isOpen: boolean
  onClose: () => void
  endpoint: {
    id: string
    name: string
    url: string
    method: string
    headers?: Record<string, string>
    body?: string
    expected_status: number
    frequency_minutes: number
    timeout_seconds: number
    is_active: boolean
    created_at: string
  } | null
}

const ViewEndpointModal: React.FC<ViewEndpointModalProps> = ({
  isOpen,
  onClose,
  endpoint
}) => {
  if (!isOpen || !endpoint) return null

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET': return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
      case 'POST': return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'PUT': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      case 'DELETE': return 'text-red-400 bg-red-400/10 border-red-400/20'
      case 'PATCH': return 'text-purple-400 bg-purple-400/10 border-purple-400/20'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{isolation: 'isolate'}}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-black border border-white/20 rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-black border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Endpoint Details</h2>
              <p className="text-sm text-gray-400">Configuration overview</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-white/10 pb-2">Basic Information</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
                  <span className="text-white font-medium">{endpoint.name}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">URL</label>
                <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
                  <span className="text-white break-all">{endpoint.url}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">HTTP Method</label>
                  <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getMethodColor(endpoint.method)}`}>
                      {endpoint.method}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Expected Status</label>
                  <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
                    <span className="text-white font-medium">{endpoint.expected_status}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Check Frequency</label>
                  <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-white font-medium">{endpoint.frequency_minutes} minutes</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Timeout</label>
                  <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg flex items-center space-x-2">
                    <Timer className="w-4 h-4 text-gray-400" />
                    <span className="text-white font-medium">{endpoint.timeout_seconds} seconds</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Status</label>
                <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg flex items-center space-x-2">
                  {endpoint.is_active ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-medium">Active</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <span className="text-red-400 font-medium">Inactive</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Headers */}
          {endpoint.headers && Object.keys(endpoint.headers).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b border-white/10 pb-2">Request Headers</h3>
              <div className="space-y-2">
                {Object.entries(endpoint.headers).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                    <span className="font-medium text-white">{key}</span>
                    <span className="text-gray-300 break-all ml-4">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Request Body */}
          {endpoint.body && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b border-white/10 pb-2">Request Body</h3>
              <div className="px-3 py-3 bg-white/5 border border-white/10 rounded-lg">
                <pre className="text-white text-sm font-mono whitespace-pre-wrap break-all">
                  {endpoint.body}
                </pre>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-white/10 pb-2">Metadata</h3>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Created At</label>
              <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
                <span className="text-white">{formatDate(endpoint.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewEndpointModal