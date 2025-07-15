import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  className = ''
}) => {
  return (
    <div className={`group p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all ${className}`}>
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <div className="text-blue-400">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

export default FeatureCard;