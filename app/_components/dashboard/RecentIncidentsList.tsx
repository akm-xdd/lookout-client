// components/dashboard/RecentIncidentsList.tsx - FIXED VERSION
import React from 'react'
import { AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { DashboardData, formatLastCheck } from '@/lib/data-loader'

interface RecentIncidentsListProps {
  data: DashboardData
  className?: string
}

const RecentIncidentsList: React.FC<RecentIncidentsListProps> = ({ 
  data, 
  className = "" 
}) => {
  // Add safety check for undefined recentIncidents
  const recentIncidents = data.recentIncidents || []
  const incidents = recentIncidents.slice(0, 5) // Show last 5 incidents

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ${minutes % 60}m`
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ongoing':
        return <AlertCircle className="w-4 h-4 text-red-400" />
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      default:
        return <Clock className="w-4 h-4 text-yellow-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'text-red-400 bg-red-400/10 border-red-400/20'
      case 'resolved':
        return 'text-green-400 bg-green-400/10 border-green-400/20'
      default:
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
    }
  }

  if (incidents.length === 0) {
    return (
      <div className={`bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 ${className}`}>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-1">Recent Incidents</h3>
          <p className="text-gray-400 text-sm">Last 30 days</p>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <CheckCircle className="w-12 h-12 text-green-400 mb-3" />
          <h4 className="text-lg font-medium text-green-400 mb-2">All Clear!</h4>
          <p className="text-gray-400 text-sm">No incidents in the last 24 hours!</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Recent Incidents</h3>
        <p className="text-gray-400 text-sm">Last {incidents.length} incidents</p>
      </div>
      
      <div className="space-y-4">
        {incidents.map((incident) => (
          <div 
            key={incident.id}
            className="border border-white/10 rounded-lg p-4 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-start space-x-3">
              {/* Status Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {getStatusIcon(incident.status)}
              </div>
              
              {/* Incident Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="text-sm font-medium text-white truncate">
                    {incident.endpointName}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(incident.status)}`}>
                    {incident.status}
                  </span>
                </div>
                
                <p className="text-xs text-gray-400 mb-2">
                  {incident.workspaceName} • {incident.cause}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>
                      Duration: {formatDuration(incident.duration)}
                    </span>
                    {incident.responseCode > 0 && (
                      <span>
                        Status: {incident.responseCode}
                      </span>
                    )}
                  </div>
                  <span>
                    {incident.status === 'ongoing' 
                      ? `Started ${formatLastCheck(incident.startTime)}`
                      : `Resolved ${formatLastCheck(incident.endTime!)}`
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* View All Link */}
      {recentIncidents.length > 5 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            View all {recentIncidents.length} incidents →
          </button>
        </div>
      )}
    </div>
  )
}

export default RecentIncidentsList