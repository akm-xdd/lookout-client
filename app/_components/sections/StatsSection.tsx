import React from 'react';

interface Stat {
  value: string;
  label: string;
}

interface StatsSectionProps {
  stats?: Stat[];
}

const defaultStats: Stat[] = [
  { value: "5", label: "Workspaces per User" },
  { value: "35", label: "Total Endpoints" },
  { value: "Free", label: "Always" },
  { value: "24/7", label: "Monitoring" }
];

const StatsSection: React.FC<StatsSectionProps> = ({ stats = defaultStats }) => {
  return (
    <div className="relative z-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;