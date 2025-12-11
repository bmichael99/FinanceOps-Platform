import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { type ChartConfig } from "@/components/ui/chart"
 
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-6)",
  },
  mobile: {
    label: "Mobile",
    color: "#FF0000",
  },
} satisfies ChartConfig

type Props = {

}

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

function ProfitChart({}: Props) {
  return (
    <div>
    <ChartContainer config={chartConfig} className="min-h-[200px] max-h-[350px] w-full">
      <AreaChart accessibilityLayer data={chartData}>
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
        <Area type="monotone" dataKey="desktop" fill="var(--color-desktop)"  />
        <Area type="monotone" dataKey="mobile" fill="var(--color-mobile)" />
      </AreaChart>
    </ChartContainer>
    </div>
  )
}

export default ProfitChart