import { Bar, BarChart, CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { type ChartConfig } from "@/components/ui/chart"
import type { InvoiceChartData, InvoiceMonthlyChartData } from "@finance-platform/types"
 
const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-revenue)",
  },
  profit: {
    label: "Profit",
    color: "var(--chart-profit)",
  },
} satisfies ChartConfig

type Props = {
  chartData: InvoiceChartData['last6Months'];
}



function RevenueChart({chartData}: Props) {
  console.log("chart data:" + JSON.stringify(chartData));
  return (
    <div>
    <ChartContainer config={chartConfig} className="min-h-[200px] max-h-[350px] w-full">
      <LineChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="formattedDate"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value : string) => value}
        />
        <YAxis 
          tickMargin={10}
          tickLine={false}
          axisLine={false}
        />
        <ReferenceLine
          y={0}
          stroke="red"
          strokeWidth={2}
        />
        <ChartTooltip content={<ChartTooltipContent indicator="dot"/>} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line type="monotone" dataKey="revenue" fill="var(--color-revenue)" stroke="var(--color-revenue)" strokeWidth={2}/>
        <Line type="monotone" dataKey="profit" fill="var(--color-profit)" stroke="var(--color-profit)" strokeWidth={2}/>
      </LineChart>
    </ChartContainer>
    </div>
  )
}

export default RevenueChart