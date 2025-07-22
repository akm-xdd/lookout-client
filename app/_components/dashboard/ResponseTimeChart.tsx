"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { OverviewData } from "@/lib/data-loader"

interface ResponseTimeChartProps {
  data: OverviewData
  className?: string
}

const chartConfig = {
  responseTime: {
    label: "Response Time: ",
    color: "hsl(262 83% 58%)",
  },
} satisfies ChartConfig

const ResponseTimeChart: React.FC<ResponseTimeChartProps> = ({ data, className = "" }) => {
  const chartData = data.responseTimeHistory.map((item) => ({
    time: new Date(item.timestamp).toLocaleTimeString('en-US', { 
      hour: 'numeric',
      hour12: true
    }),
    responseTime: item.avgResponseTime,
    fullTimestamp: item.timestamp
  }))

  if (chartData.length === 0) {
    return (
      <div className={`bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 ${className}`}>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-1">Response Time</h3>
          <p className="text-gray-400 text-sm">Last 24 hours</p>
        </div>
        <div className="flex items-center justify-center h-[200px] text-gray-500">
          No response time data available
        </div>
      </div>
    )
  }

  const avgResponseTime = chartData.reduce((sum, item) => sum + item.responseTime, 0) / chartData.length

  // FIXED: Proper trend analysis that considers the context
  const getTrendAnalysis = () => {
    if (chartData.length < 2) return { direction: 'stable', change: 0, isValid: false }
    
    // Compare first quarter vs last quarter of data points for more stable analysis
    const quarterSize = Math.max(1, Math.floor(chartData.length / 4))
    
    const firstQuarter = chartData.slice(0, quarterSize)
    const lastQuarter = chartData.slice(-quarterSize)
    
    const firstAvg = firstQuarter.reduce((sum, item) => sum + item.responseTime, 0) / firstQuarter.length
    const lastAvg = lastQuarter.reduce((sum, item) => sum + item.responseTime, 0) / lastQuarter.length
    
    const change = lastAvg - firstAvg
    const percentageChange = Math.abs(change) / firstAvg * 100
    
    // Only show trend if change is significant (>10%)
    if (percentageChange < 10) {
      return { direction: 'stable', change, isValid: true }
    }
    
    return {
      direction: change > 0 ? 'slower' : 'faster',
      change,
      isValid: true,
      percentageChange
    }
  }

  const trend = getTrendAnalysis()

  const getTrendIcon = () => {
    if (!trend.isValid) return '→'
    switch (trend.direction) {
      case 'faster': return '↘'
      case 'slower': return '↗'
      default: return '→'
    }
  }

  const getTrendText = () => {
    if (!trend.isValid) return 'Not enough data'
    
    switch (trend.direction) {
      case 'faster': 
        return `${Math.abs(trend.change).toFixed(0)}ms faster`
      case 'slower': 
        return `${Math.abs(trend.change).toFixed(0)}ms slower`
      default: 
        return 'Stable performance'
    }
  }

  const getTrendColor = () => {
    if (!trend.isValid) return 'text-gray-400'
    switch (trend.direction) {
      case 'faster': return 'text-green-400'
      case 'slower': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className={`bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-1">Response Time</h3>
        <p className="text-gray-400 text-sm">Last 24 hours</p>
      </div>
      
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <LineChart
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
            dataKey="time"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 12, fill: "rgba(255, 255, 255, 0.6)" }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 12, fill: "rgba(255, 255, 255, 0.6)" }}
            tickFormatter={(value) => `${value}ms`}
          />
          <ChartTooltip
            content={<ChartTooltipContent />}
            cursor={{ stroke: "rgba(139, 92, 246, 0.3)", strokeWidth: 2 }}
          />
          <Line
            dataKey="responseTime"
            type="monotone"
            stroke="hsl(262 83% 58%)"
            strokeWidth={3}
            dot={{
              fill: "hsl(262 83% 58%)",
              strokeWidth: 2,
              r: 4,
            }}
            activeDot={{
              r: 6,
              stroke: "hsl(262 83% 58%)",
              strokeWidth: 2,
              fill: "hsl(262 83% 58%)",
            }}
          />
        </LineChart>
      </ChartContainer>
      
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="text-gray-400">
          Average: {Math.round(avgResponseTime)}ms
        </div>
        <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
          <span>{getTrendIcon()}</span>
          <span>{getTrendText()}</span>
        </div>
      </div>
    </div>
  )
}

export default ResponseTimeChart
