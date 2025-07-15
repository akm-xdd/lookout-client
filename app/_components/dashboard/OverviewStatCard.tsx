// components/dashboard/OverviewStatCard.tsx
import React from 'react'
import { LucideIcon } from 'lucide-react'

interface OverviewStatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  color?: 'blue' | 'purple' | 'green' | 'red' | 'yellow'
  progress?: {
    current: number
    max: number
  }
  trend?: {
    direction: 'up' | 'down'
    value: string
  }
}

const OverviewStatCard: React.FC<OverviewStatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
  progress,
  trend
}) => {
  const colorClasses = {
    blue: 'text-blue-400',
    purple: 'text-purple-400', 
    green: 'text-green-400',
    red: 'text-red-400',
    yellow: 'text-yellow-400'
  }

  const progressColors = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500', 
    red: 'bg-red-500',
    yellow: 'bg-yellow-500'
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:bg-white/8 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        {Icon && (
          <Icon className={`w-5 h-5 ${colorClasses[color]}`} />
        )}
      </div>

      {/* Main Value */}
      <div className="mb-2">
        <div className={`text-3xl font-bold ${colorClasses[color]} mb-1`}>
          {value}
        </div>
        {subtitle && (
          <div className="text-gray-400 text-sm">
            {subtitle}
          </div>
        )}
      </div>

      {/* Progress Bar (if provided) */}
      {progress && (
        <div className="mb-3">
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className={`${progressColors[color]} h-2 rounded-full transition-all`}
              style={{ 
                width: `${Math.min((progress.current / progress.max) * 100, 100)}%` 
              }}
            />
          </div>
        </div>
      )}

      {/* Trend (if provided) */}
      {trend && (
        <div className="flex items-center text-sm">
          <span className={trend.direction === 'up' ? 'text-green-400' : 'text-red-400'}>
            {trend.direction === 'up' ? '↗' : '↘'} {trend.value}
          </span>
          <span className="text-gray-500 ml-1">vs last week</span>
        </div>
      )}
    </div>
  )
}

export default OverviewStatCard