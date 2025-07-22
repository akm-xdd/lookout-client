// hooks/useDashboardMetrics.ts
"use client";
import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '@/lib/api-client';

// Types matching our backend schema
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

export interface DashboardMetricsData {
  healthScore: HealthScoreMetric;
  incidents: IncidentsMetric;
  responseTime: ResponseTimeMetric;
  statusDistribution: StatusDistributionMetric;
  calculatedAt: string;
  totalEndpoints: number;
  activeEndpoints: number;
}

// Hook to use dashboard metrics
export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: dashboardAPI.getMetrics,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 25000, // Consider data stale after 25 seconds
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// EXISTING: Keep the old dashboard hook for workspace data during transition
export const useDashboardData = () => {
  return useQuery({
    queryKey: ['dashboard-data'],
    queryFn: dashboardAPI.getDashboard,
    refetchInterval: 30000,
    staleTime: 25000,
    retry: 2,
  });
};

// Individual metric hooks for granular updates (optional)
export const useHealthScore = () => {
  const { data, ...rest } = useDashboardMetrics();
  return {
    data: data?.healthScore,
    ...rest
  };
};

export const useIncidents = () => {
  const { data, ...rest } = useDashboardMetrics();
  return {
    data: data?.incidents,
    ...rest
  };
};

export const useResponseTimeMetrics = () => {
  const { data, ...rest } = useDashboardMetrics();
  return {
    data: data?.responseTime,
    ...rest
  };
};

export const useStatusDistribution = () => {
  const { data, ...rest } = useDashboardMetrics();
  return {
    data: data?.statusDistribution,
    ...rest
  };
};