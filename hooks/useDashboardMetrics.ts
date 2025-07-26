// @ts-nocheck

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

// OPTIMIZED: Main dashboard metrics hook
export const useDashboardMetrics = (options?: {
  enabled?: boolean;
  refetchInterval?: number;
  staleTime?: number;
}) => {
  const {
    enabled = true,
    refetchInterval = 5 * 60 * 1000, // 5 minutes
    staleTime = 4 * 60 * 1000, // 4 minutes
  } = options || {};

  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: dashboardAPI.getMetrics,
    enabled,
    refetchInterval,
    staleTime,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    
    // ADD: Prevent over-polling (same as workspace hook)
    refetchOnWindowFocus: false, // Don't refetch on tab switching
    refetchOnMount: false, // Use cached data if available
    refetchOnReconnect: true, // Refetch on network reconnection
    
    // Cache management
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes after unmount
    
    // Error handling
    throwOnError: false, // Let components handle errors gracefully
  });
};

// OPTIMIZED: Dashboard data hook with same settings
export const useDashboardData = (options?: {
  enabled?: boolean;
  refetchInterval?: number;
  staleTime?: number;
}) => {
  const {
    enabled = true,
    refetchInterval = 5 * 60 * 1000, // 5 minutes
    staleTime = 4 * 60 * 1000, // 4 minutes
  } = options || {};

  return useQuery({
    queryKey: ['dashboard-data'],
    queryFn: dashboardAPI.getDashboard,
    enabled,
    refetchInterval,
    staleTime,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    
    // ADD: Same optimizations
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    gcTime: 10 * 60 * 1000,
    throwOnError: false,
  });
};

// SUGGESTION: Unified dashboard hook to prevent duplicate requests
export const useDashboard = () => {
  // If both hooks call similar endpoints, consider combining them
  return useQuery({
    queryKey: ['dashboard-unified'],
    queryFn: async () => {
      // Combine both API calls if they're related
      const [metrics, data] = await Promise.all([
        dashboardAPI.getMetrics(),
        dashboardAPI.getDashboard()
      ]);
      return { metrics, data };
    },
    refetchInterval: 5 * 60 * 1000,
    staleTime: 4 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    gcTime: 10 * 60 * 1000,
    throwOnError: false,
  });
};

// OPTIMIZED: Individual metric hooks (these are good as-is, just small improvements)
export const useHealthScore = () => {
  const { data, isLoading, isError, error, isFetching } = useDashboardMetrics();
  return {
    data: data?.healthScore,
    isLoading,
    isError,
    error,
    isFetching,
    // ADD: Helper for checking if specifically health score is loading
    hasData: !!data?.healthScore,
  };
};

export const useIncidents = () => {
  const { data, isLoading, isError, error, isFetching } = useDashboardMetrics();
  return {
    data: data?.incidents,
    isLoading,
    isError,
    error,
    isFetching,
    hasData: !!data?.incidents,
  };
};

export const useResponseTimeMetrics = () => {
  const { data, isLoading, isError, error, isFetching } = useDashboardMetrics();
  return {
    data: data?.responseTime,
    isLoading,
    isError,
    error,
    isFetching,
    hasData: !!data?.responseTime,
    // ADD: Helper for chart data
    chartData: data?.responseTime?.chartData || [],
  };
};

export const useStatusDistribution = () => {
  const { data, isLoading, isError, error, isFetching } = useDashboardMetrics();
  return {
    data: data?.statusDistribution,
    isLoading,
    isError,
    error,
    isFetching,
    hasData: !!data?.statusDistribution,
  };
};

// ADD: Manual refresh hook for dashboard
export const useRefreshDashboardMetrics = () => {
  const { refetch, isFetching } = useDashboardMetrics({ enabled: false });
  
  const refresh = async () => {
    // console.log('🔄 Manual dashboard metrics refresh triggered');
    return await refetch();
  };
  
  return {
    refresh,
    isRefreshing: isFetching,
  };
};

// ADD: Different modes for different dashboard contexts
export const useDashboardMetricsRealtime = () => {
  return useDashboardMetrics({
    refetchInterval: 2 * 60 * 1000, // 2 minutes for real-time monitoring
    staleTime: 90 * 1000, // 90 seconds
  });
};

export const useDashboardMetricsWidget = () => {
  return useDashboardMetrics({
    refetchInterval: 10 * 60 * 1000, // 10 minutes for dashboard widgets
    staleTime: 8 * 60 * 1000, // 8 minutes
  });
};