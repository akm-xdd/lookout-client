// components/dashboard/ResponseTimeChart.tsx - FIXED VERSION
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
    color: "hsl(262 83% 58%)", // Use actual color value
  },
} satisfies ChartConfig

const ResponseTimeChart: React.FC<ResponseTimeChartProps> = ({ data, className = "" }) => {
  // Transform data for chart
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
          <p className="text-gray-400 text-sm">Last 5 hours</p>
        </div>
        <div className="flex items-center justify-center h-[200px] text-gray-500">
          No response time data available
        </div>
      </div>
    )
  }

  const avgResponseTime = chartData.reduce((sum, item) => sum + item.responseTime, 0) / chartData.length
  const trend = chartData.length > 1 ? 
    chartData[chartData.length - 1].responseTime - chartData[0].responseTime : 0

  return (
    <div className={`bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-1">Response Time</h3>
        <p className="text-gray-400 text-sm">Last 5 hours</p>
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
        <div className={trend > 0 ? "text-red-400" : "text-green-400"}>
          {trend > 0 ? "↗" : "↘"} {trend > 0 ? "Slower" : "Faster"} than start
        </div>
      </div>
    </div>
  )
}

export default ResponseTimeChart