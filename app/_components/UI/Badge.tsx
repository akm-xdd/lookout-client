import React from 'react';
import { LucideIcon } from 'lucide-react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  icon: Icon,
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center rounded-full backdrop-blur-sm border font-medium';
  
  const variantClasses = {
    default: 'bg-white/5 border-white/10 text-gray-300',
    success: 'bg-green-500/10 border-green-500/20 text-green-400',
    warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    error: 'bg-red-500/10 border-red-500/20 text-red-400',
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-400'
  };
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const iconClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <div className={classes}>
      {Icon && (
        <Icon className={`${iconClasses[size]} mr-2`} />
      )}
      <span>{children}</span>
    </div>
  );
};

export default Badge;