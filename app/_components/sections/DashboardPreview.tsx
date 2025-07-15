import React from 'react';

interface DashboardItem {
  name: string;
  status: 'online' | 'warning' | 'offline';
  uptime: string;
  avgResponse: string;
}

interface DashboardPreviewProps {
  title?: string;
  subtitle?: string;
  items?: DashboardItem[];
}

const defaultItems: DashboardItem[] = [
  {
    name: "My Portfolio Site",
    status: "online",
    uptime: "99.9% uptime",
    avgResponse: "245ms avg"
  },
  {
    name: "Task Manager API",
    status: "online",
    uptime: "98.7% uptime",
    avgResponse: "412ms avg"
  },
  {
    name: "Weather App",
    status: "warning",
    uptime: "96.2% uptime",
    avgResponse: "1.2s avg"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online':
      return 'bg-green-500';
    case 'warning':
      return 'bg-yellow-500';
    case 'offline':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const DashboardPreview: React.FC<DashboardPreviewProps> = ({ 
  title = "Clean, Developer-Friendly Interface",
  subtitle = "No bloat, no confusion. Just the tools you need to monitor your projects effectively.",
  items = defaultItems
}) => {
  return (
    <div className="relative z-10 px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-2xl blur-3xl"></div>
          <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
            {/* Browser Chrome */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            
            {/* Dashboard Items */}
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 ${getStatusColor(item.status)} rounded-full animate-pulse`}></div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{item.uptime}</span>
                    <span>{item.avgResponse}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;