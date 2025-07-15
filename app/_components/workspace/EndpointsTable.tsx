// components/workspace/EndpointsTable.tsx
import React from 'react'
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
import { EndpointData, formatResponseTime, formatLastCheck } from '@/lib/data-loader'

interface EndpointsTableProps {
  endpoints: EndpointData[]
  className?: string
}

const EndpointsTable: React.FC<EndpointsTableProps> = ({ endpoints, className = "" }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />
      case 'offline':
        return <AlertCircle className="w-4 h-4 text-red-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400 bg-green-400/10'
      case 'warning': return 'text-yellow-400 bg-yellow-400/10'
      case 'offline': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99) return 'text-green-400'
    if (uptime >= 95) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getResponseTimeColor = (responseTime: number) => {
    if (responseTime === 0) return 'text-gray-400'
    if (responseTime < 500) return 'text-green-400'
    if (responseTime < 1000) return 'text-yellow-400'
    return 'text-red-400'
  }

  const handleTest = (endpoint: EndpointData) => {
    toast.info(`Testing ${endpoint.name}...`, {
      description: 'Endpoint testing is being built',
      duration: 3000,
    })
  }

  const handleEdit = (endpoint: EndpointData) => {
    toast.info(`Edit ${endpoint.name}`, {
      description: 'Edit endpoint functionality is being built',
      duration: 3000,
    })
  }

  const handleDelete = (endpoint: EndpointData) => {
    toast.info(`Delete ${endpoint.name}`, {
      description: 'Delete endpoint functionality is being built',
      duration: 3000,
    })
  }

  const handleVisitUrl = (url: string) => {
    window.open(url, '_blank')
  }

  if (endpoints.length === 0) {
    return (
      <div className={`bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center ${className}`}>
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
          <ExternalLink className="w-8 h-8 text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No endpoints yet</h3>
        <p className="text-gray-400 mb-6">
          Add your first endpoint to start monitoring this workspace
        </p>
        <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all mx-auto">
          <ExternalLink className="w-4 h-4" />
          <span>Add Endpoint</span>
        </button>
      </div>
    )
  }

  return (
    <div className={`bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden ${className}`}>
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-white/10">
        <h3 className="text-lg font-semibold">Endpoints</h3>
        <p className="text-gray-400 text-sm">
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
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          endpoint.method === 'GET' ? 'bg-green-500/20 text-green-400' :
                          endpoint.method === 'POST' ? 'bg-blue-500/20 text-blue-400' :
                          endpoint.method === 'PUT' ? 'bg-yellow-500/20 text-yellow-400' :
                          endpoint.method === 'DELETE' ? 'bg-red-500/20 text-red-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {endpoint.method}
                        </span>
                        <button
                          onClick={() => handleVisitUrl(endpoint.url)}
                          className="text-gray-400 hover:text-blue-400 transition-colors text-sm truncate max-w-xs"
                          title={endpoint.url}
                        >
                          {endpoint.url}
                        </button>
                        <ExternalLink className="w-3 h-3 text-gray-500" />
                      </div>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(endpoint.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(endpoint.status)}`}>
                      {endpoint.status}
                    </span>
                  </div>
                </td>

                {/* Uptime */}
                <td className="py-4 px-4">
                  <span className={`font-medium ${getUptimeColor(endpoint.uptime)}`}>
                    {endpoint.uptime.toFixed(1)}%
                  </span>
                </td>

                {/* Response Time */}
                <td className="py-4 px-4">
                  <div>
                    <span className={`font-medium ${getResponseTimeColor(endpoint.responseTime)}`}>
                      {formatResponseTime(endpoint.responseTime)}
                    </span>
                    <div className="text-xs text-gray-500">
                      avg {formatResponseTime(endpoint.avgResponseTime)}
                    </div>
                  </div>
                </td>

                {/* Last Check */}
                <td className="py-4 px-4">
                  <span className="text-gray-300">
                    {formatLastCheck(endpoint.lastCheck)}
                  </span>
                </td>

                {/* Frequency */}
                <td className="py-4 px-4">
                  <span className="text-gray-300">
                    {endpoint.frequency < 60 ? `${endpoint.frequency}s` :
                     endpoint.frequency < 3600 ? `${Math.round(endpoint.frequency / 60)}m` :
                     `${Math.round(endpoint.frequency / 3600)}h`}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleTest(endpoint)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                      title="Test endpoint"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(endpoint)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                      title="Edit endpoint"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(endpoint)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      title="Delete endpoint"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default EndpointsTable