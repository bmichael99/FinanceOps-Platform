import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { type ChartConfig } from "@/components/ui/chart"
import type { InvoiceChartData, InvoiceMonthlyChartData } from "@finance-platform/types"
 
const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-6)",
  },
  profit: {
    label: "Profit",
    color: "var(--chart-7)",
  },
} satisfies ChartConfig

type Props = {
  chartData: InvoiceMonthlyChartData[]
}



function RevenueChart({chartData}: Props) {
  return (
    <div>
    <ChartContainer config={chartConfig} className="min-h-[200px] max-h-[350px] w-full">
      <LineChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent indicator="dot"/>} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line type="monotone" dataKey="revenue" fill="var(--color-revenue)"  />
        <Line type="monotone" dataKey="profit" fill="var(--color-profit)" />
      </LineChart>
    </ChartContainer>
    </div>
  )
}

export default RevenueChart