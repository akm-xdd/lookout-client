import React from 'react';

interface StatCardProps {
  value: string;
  label: string;
  className?: string;
  valueClassName?: string;
  labelClassName?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  className = '',
  valueClassName = '',
  labelClassName = ''
}) => {
  return (
    <div className={`text-center ${className}`}>
      <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 ${valueClassName}`}>
        {value}
      </div>
      <div className={`text-gray-400 text-sm ${labelClassName}`}>
        {label}
      </div>
    </div>
  );
};

export default StatCard;