import React from 'react';

interface StatusIndicatorProps {
  status: 'online' | 'warning' | 'offline' | 'unknown';
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  showLabel?: boolean;
  className?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'md',
  animate = true,
  showLabel = false,
  className = ''
}) => {
  const statusConfig = {
    online: {
      color: 'bg-green-500',
      label: 'Online'
    },
    warning: {
      color: 'bg-yellow-500',
      label: 'Warning'
    },
    offline: {
      color: 'bg-red-500',
      label: 'Offline'
    },
    unknown: {
      color: 'bg-gray-500',
      label: 'Unknown'
    }
  };

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const config = statusConfig[status];
  const dotClasses = `${sizeClasses[size]} ${config.color} rounded-full ${animate ? 'animate-pulse' : ''}`;

  if (showLabel) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className={dotClasses}></div>
        <span className="text-sm text-gray-400">{config.label}</span>
      </div>
    );
  }

  return <div className={`${dotClasses} ${className}`}></div>;
};

export default StatusIndicator;