// components/workspace/EndpointsTable.tsx - MINIMAL FIXES
import React, { useState } from 'react'
import { 
  ExternalLink, 
  Play, 
  Edit, 
  Trash2, 
  MoreVertical,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { EndpointData, formatResponseTime, formatLastCheck, formatUptime } from '@/lib/data-loader'
import DeleteEndpointModal from './DeleteEndpointModal'

interface EndpointsTableProps {
  endpoints: EndpointData[]
  workspaceId: string
  onEndpointDeleted: () => void
  onAddEndpoint: () => void
  className?: string
}

const EndpointsTable: React.FC<EndpointsTableProps> = ({ 
  endpoints, 
  workspaceId, 
  onEndpointDeleted, 
  onAddEndpoint,
  className = "" 
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [endpointToDelete, setEndpointToDelete] = useState<{
    id: string
    name: string
    url: string
    method: string
  } | null>(null)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />
      case 'offline':
        return <AlertCircle className="w-4 h-4 text-red-400" />
      case 'unknown':
        return <Clock className="w-4 h-4 text-gray-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400 bg-green-400/10'
      case 'warning': return 'text-yellow-400 bg-yellow-400/10'
      case 'offline': return 'text-red-400 bg-red-400/10'
      case 'unknown': return 'text-gray-400 bg-gray-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const getUptimeColor = (uptime: number | null) => {
    if (uptime === null) return 'text-gray-400'
    if (uptime >= 99) return 'text-green-400'
    if (uptime >= 95) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getResponseTimeColor = (responseTime: number | null) => {
    if (responseTime === null) return 'text-gray-400'
    if (responseTime < 500) return 'text-green-400'
    if (responseTime < 1000) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET': return 'text-blue-400 bg-blue-400/10'
      case 'POST': return 'text-green-400 bg-green-400/10'
      case 'PUT': return 'text-yellow-400 bg-yellow-400/10'
      case 'DELETE': return 'text-red-400 bg-red-400/10'
      case 'PATCH': return 'text-purple-400 bg-purple-400/10'
      case 'HEAD': return 'text-gray-400 bg-gray-400/10'
      case 'OPTIONS': return 'text-orange-400 bg-orange-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const handleTestEndpoint = (endpoint: EndpointData) => {
    toast.info(`Testing ${endpoint.name}...`, {
      description: 'This feature is being built',
      duration: 3000,
    })
  }

  const handleEditEndpoint = (endpoint: EndpointData) => {
    toast.info(`Edit ${endpoint.name}`, {
      description: 'This feature is being built',
      duration: 3000,
    })
  }

  const handleDeleteEndpoint = (endpoint: EndpointData) => {
    setEndpointToDelete({
      id: endpoint.id,
      name: endpoint.name,
      url: endpoint.url,
      method: endpoint.method
    })
    setDeleteModalOpen(true)
  }

  const handleVisitUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (endpoints.length === 0) {
    return (
      <div className={`bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center ${className}`}>
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-xl font-semibold text-white mb-2">No Endpoints Yet</h3>
        <p className="text-gray-400 mb-6">
          Start monitoring by adding your first endpoint. We'll keep it awake and track its uptime.
        </p>
        <button
          onClick={onAddEndpoint}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Add Your First Endpoint
        </button>
      </div>
    )
  }

  return (
    <div className={`bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Endpoints</h2>
          <button
            onClick={onAddEndpoint}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
          >
            Add Endpoint
          </button>
        </div>
        <p className="text-gray-400 text-sm mt-1">
          {endpoints.length} endpoint{endpoints.length !== 1 ? 's' : ''} configured
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-6 text-gray-400 font-medium text-sm">
                Endpoint
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                Status
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                Uptime
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                Response
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                Last Check
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                Frequency
              </th>
              <th className="text-right py-3 px-6 text-gray-400 font-medium text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {endpoints.map((endpoint) => (
              <tr
                key={endpoint.id}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                {/* Endpoint Name & URL */}
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white mb-1">
                        {endpoint.name}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(endpoint.method)}`}>
                          {endpoint.method}
                        </span>
                        <button
                          onClick={() => handleVisitUrl(endpoint.url)}
                          className="text-blue-400 hover:text-blue-300 text-xs transition-colors break-all"
                          title="Visit URL"
                        >
                          {endpoint.url}
                        </button>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(endpoint.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(endpoint.status)}`}>
                      {endpoint.status}
                    </span>
                  </div>
                </td>

                {/* Uptime */}
                <td className="py-4 px-4">
                  <span className={`font-medium ${getUptimeColor(endpoint.uptime)}`}>
                    {formatUptime(endpoint.uptime)}
                  </span>
                </td>

                {/* Response Time */}
                <td className="py-4 px-4">
                  <span className={`font-medium ${getResponseTimeColor(endpoint.responseTime)}`}>
                    {formatResponseTime(endpoint.responseTime)}
                  </span>
                </td>

                {/* Last Check */}
                <td className="py-4 px-4">
                  <span className="text-gray-400 text-sm">
                    {formatLastCheck(endpoint.lastCheck)}
                  </span>
                </td>

                {/* Frequency */}
                <td className="py-4 px-4">
                  <span className="text-gray-300 text-sm">
                    {endpoint.frequency}m
                  </span>
                </td>

                {/* Actions */}
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleTestEndpoint(endpoint)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title="Test endpoint"
                    >
                      <Play className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleEditEndpoint(endpoint)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title="Edit endpoint"
                    >
                      <Edit className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteEndpoint(endpoint)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title="Delete endpoint"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      {deleteModalOpen && endpointToDelete && (
        <DeleteEndpointModal
          endpoint={endpointToDelete}
          workspaceId={workspaceId}
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false)
            setEndpointToDelete(null)
          }}
          onSuccess={() => {
            setDeleteModalOpen(false)
            setEndpointToDelete(null)
            onEndpointDeleted()
          }}
        />
      )}
    </div>
  )
}

export default EndpointsTable