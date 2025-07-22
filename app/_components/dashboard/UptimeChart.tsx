"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { OverviewData } from "@/lib/data-loader"

interface UptimeChartProps {
  data: OverviewData
  className?: string
}

const chartConfig = {
  uptime: {
    label: "Uptime",
    color: "hsl(142 71% 45%)",
  },
} satisfies ChartConfig

const UptimeChart: React.FC<UptimeChartProps> = ({ data, className = "" }) => {
  // Transform data for chart
  const chartData = data.uptimeHistory.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }),
    uptime: item.uptime,
    fullDate: item.date
  }))

  if (chartData.length === 0) {
    return (
      <div className={`bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 ${className}`}>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-1">Uptime Trend</h3>
          <p className="text-gray-400 text-sm">Last 7 days</p>
        </div>
        <div className="flex items-center justify-center h-[200px] text-gray-500">
          No uptime data available
        </div>
      </div>
    )
  }

  // Calculate dynamic Y-axis domain for better scaling
  const uptimeValues = chartData.map(item => item.uptime)
  const minUptime = Math.min(...uptimeValues)
  const maxUptime = Math.max(...uptimeValues)
  
  // Create padding around the data for better visualization
  const range = maxUptime - minUptime
  const padding = Math.max(range * 0.2, 2) // At least 2% padding
  
  const yAxisMin = Math.max(0, minUptime - padding)
  const yAxisMax = Math.min(100, maxUptime + padding)

  // FIXED: Calculate average from chart data or use avgUptime from data
  const calculateAverageUptime = () => {
    if (data.avgUptime !== null && data.avgUptime !== undefined) {
      return data.avgUptime
    }
    
    // Fallback: calculate from chart data
    if (chartData.length > 0) {
      const sum = chartData.reduce((acc, item) => acc + item.uptime, 0)
      return sum / chartData.length
    }
    
    return null
  }

  const averageUptime = calculateAverageUptime()

  // Calculate actual trend based on data points
  const getTrendAnalysis = () => {
    if (chartData.length < 2) return { direction: 'stable', change: 0 }
    
    const firstValue = chartData[0].uptime
    const lastValue = chartData[chartData.length - 1].uptime
    const change = lastValue - firstValue
    
    if (Math.abs(change) < 2) return { direction: 'stable', change }
    if (change > 0) return { direction: 'improving', change }
    return { direction: 'declining', change }
  }

  const trend = getTrendAnalysis()

  const getTrendIcon = () => {
    switch (trend.direction) {
      case 'improving': return '↗'
      case 'declining': return '↘'
      default: return '→'
    }
  }

  const getTrendText = () => {
    switch (trend.direction) {
      case 'improving': return `Improving (+${Math.abs(trend.change).toFixed(1)}%)`
      case 'declining': return `Declining (-${Math.abs(trend.change).toFixed(1)}%)`
      default: return 'Stable'
    }
  }

  const getTrendColor = () => {
    switch (trend.direction) {
      case 'improving': return 'text-green-400'
      case 'declining': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className={`bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-1">Uptime Trend</h3>
        <p className="text-gray-400 text-sm">Last 7 days</p>
      </div>
      
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
            top: 12,
            bottom: 12,
          }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(255, 255, 255, 0.1)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 12, fill: "rgba(255, 255, 255, 0.6)" }}
          />
          <YAxis
            domain={[yAxisMin, yAxisMax]}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 12, fill: "rgba(255, 255, 255, 0.6)" }}
            tickFormatter={(value) => `${value.toFixed(1)}%`}
          />
          <ChartTooltip
            content={<ChartTooltipContent />}
            cursor={false}
          />
          <defs>
            <linearGradient id="fillUptime" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(142 71% 45%)"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="hsl(142 71% 45%)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <Area
            dataKey="uptime"
            type="monotone"
            fill="url(#fillUptime)"
            fillOpacity={0.6}
            stroke="hsl(142 71% 45%)"
            strokeWidth={2}
            dot={false}
          />
        </AreaChart>
      </ChartContainer>
      
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="text-gray-400">
          Average: {averageUptime !== null ? `${averageUptime.toFixed(1)}%` : 'N/A'}
        </div>
        <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
          <span>{getTrendIcon()}</span>
          <span>{getTrendText()}</span>
        </div>
      </div>
    </div>
  )
}

export default UptimeChart
