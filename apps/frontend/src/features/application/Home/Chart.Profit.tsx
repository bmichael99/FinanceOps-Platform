import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { type ChartConfig } from "@/components/ui/chart"
import type { InvoiceChartData, InvoiceMonthlyChartData } from "@finance-platform/types"
 
const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-revenue)",
  },
  expenditure: {
    label: "Expenses",
    color: "var(--chart-expenditure)",
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
      <AreaChart accessibilityLayer data={chartData}>
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

        <ChartTooltip content={<ChartTooltipContent indicator="dot"/>} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area type="monotone" dataKey="revenue" fill="var(--color-revenue)" stroke="var(--color-revenue)"/>
        <Area type="monotone" dataKey="expenditure" fill="var(--color-expenditure)" stroke="var(--color-expenditure)"/>
      </AreaChart>
    </ChartContainer>
    </div>
  )
}

export default RevenueChart