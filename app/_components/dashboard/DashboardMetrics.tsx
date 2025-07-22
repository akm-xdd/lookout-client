"use client";
import React from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Minus,
  CheckCircle,
  XCircle,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Types for our new metrics
interface HealthScoreMetric {
  current: number;
  trend: "up" | "down" | "stable";
  change: number;
}

interface IncidentsMetric {
  current: number;
  trend: "up" | "down" | "stable";
  change: number;
}

interface ResponseTimeDataPoint {
  timestamp: string;
  avgResponseTime: number;
}

interface ResponseTimeMetric {
  current: number;
  trend: "up" | "down" | "stable";
  change: number;
  chartData: ResponseTimeDataPoint[];
}

interface StatusDistributionMetric {
  online: number;
  warning: number;
  offline: number;
  unknown: number;
}

interface DashboardMetricsData {
  healthScore: HealthScoreMetric;
  incidents: IncidentsMetric;
  responseTime: ResponseTimeMetric;
  statusDistribution: StatusDistributionMetric;
  calculatedAt: string;
  totalEndpoints: number;
  activeEndpoints: number;
}

interface DashboardMetricsProps {
  data: DashboardMetricsData;
  loading?: boolean;
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ data, loading = false }) => {
  if (loading) {
    return <DashboardMetricsLoading />;
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = (trend: string, isPositive: boolean = true) => {
    if (trend === 'stable') return 'text-gray-400';
    
    const isGoodTrend = isPositive ? trend === 'up' : trend === 'down';
    return isGoodTrend ? 'text-green-400' : 'text-red-400';
  };

  const formatHealthChange = (change: number) => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  const formatResponseTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const formatResponseTimeChange = (change: number) => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Portfolio Health Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Activity className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold">Portfolio Health</h3>
              <p className="text-sm text-gray-400">24-hour uptime</p>
            </div>
          </div>
          <div className={`flex items-center space-x-1 ${getTrendColor(data.healthScore.trend, true)}`}>
            {getTrendIcon(data.healthScore.trend)}
            <span className="text-sm font-medium">
              {formatHealthChange(data.healthScore.change)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-3xl font-bold text-white">
            {data.healthScore.current.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-400">
            of {data.totalEndpoints} total endpoints
          </div>
        </div>
      </motion.div>

      {/* Active Incidents */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              data.incidents.current > 0 ? 'bg-red-500/20' : 'bg-gray-500/20'
            }`}>
              <AlertTriangle className={`w-5 h-5 ${
                data.incidents.current > 0 ? 'text-red-400' : 'text-gray-400'
              }`} />
            </div>
            <div>
              <h3 className="font-semibold">Active Incidents</h3>
              <p className="text-sm text-gray-400">Endpoints offline</p>
            </div>
          </div>
          {data.incidents.change !== 0 && (
            <div className={`flex items-center space-x-1 ${getTrendColor(data.incidents.trend, false)}`}>
              {getTrendIcon(data.incidents.trend)}
              <span className="text-sm font-medium">
                {data.incidents.change > 0 ? '+' : ''}{data.incidents.change}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className={`text-3xl font-bold ${
            data.incidents.current > 0 ? 'text-red-400' : 'text-gray-400'
          }`}>
            {data.incidents.current}
          </div>
          <div className="text-sm text-gray-400">
            {data.incidents.current === 0 ? 'All systems operational' : 
             data.incidents.current === 1 ? 'incident needs attention' : 'incidents need attention'}
          </div>
        </div>
      </motion.div>

      {/* Response Time Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold">Response Time</h3>
              <p className="text-sm text-gray-400">24-hour average</p>
            </div>
          </div>
          <div className={`flex items-center space-x-1 ${getTrendColor(data.responseTime.trend, false)}`}>
            {getTrendIcon(data.responseTime.trend)}
            <span className="text-sm font-medium">
              {formatResponseTimeChange(data.responseTime.change)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mb-4">
          <div className="text-3xl font-bold text-white">
            {formatResponseTime(data.responseTime.current)}
          </div>
          <div className="text-sm text-gray-400">
            current average
          </div>
        </div>

        {/* Mini Chart */}
        {data.responseTime.chartData.length > 0 && (
          <div className="h-16 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.responseTime.chartData}>
                <Line 
                  type="monotone" 
                  dataKey="avgResponseTime" 
                  stroke="#60A5FA" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>

      {/* Status Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Activity className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold">Endpoint Status</h3>
            <p className="text-sm text-gray-400">Current distribution</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm">Online</span>
            </div>
            <span className="font-medium text-green-400">{data.statusDistribution.online}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">Warning</span>
            </div>
            <span className="font-medium text-yellow-400">{data.statusDistribution.warning}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <XCircle className="w-4 h-4 text-red-400" />
              <span className="text-sm">Offline</span>
            </div>
            <span className="font-medium text-red-400">{data.statusDistribution.offline}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-gray-400" />
              <span className="text-sm">Unknown</span>
            </div>
            <span className="font-medium text-gray-400">{data.statusDistribution.unknown}</span>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-4">
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden flex">
            {data.totalEndpoints > 0 && (
              <>
                <div 
                  className="bg-green-400"
                  style={{ width: `${(data.statusDistribution.online / data.totalEndpoints) * 100}%` }}
                />
                <div 
                  className="bg-yellow-400"
                  style={{ width: `${(data.statusDistribution.warning / data.totalEndpoints) * 100}%` }}
                />
                <div 
                  className="bg-red-400"
                  style={{ width: `${(data.statusDistribution.offline / data.totalEndpoints) * 100}%` }}
                />
                <div 
                  className="bg-gray-400"
                  style={{ width: `${(data.statusDistribution.unknown / data.totalEndpoints) * 100}%` }}
                />
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Loading skeleton component
const DashboardMetricsLoading: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="animate-pulse">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-9 h-9 bg-white/10 rounded-lg"></div>
              <div>
                <div className="h-4 bg-white/10 rounded w-24 mb-2"></div>
                <div className="h-3 bg-white/10 rounded w-16"></div>
              </div>
            </div>
            <div className="h-8 bg-white/10 rounded w-20 mb-4"></div>
            {i === 2 && <div className="h-16 bg-white/10 rounded"></div>}
            {i === 3 && (
              <div className="space-y-2">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex justify-between">
                    <div className="h-4 bg-white/10 rounded w-16"></div>
                    <div className="h-4 bg-white/10 rounded w-6"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardMetrics;
