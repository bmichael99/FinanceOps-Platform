import { Bar, BarChart, CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { type ChartConfig } from "@/components/ui/chart"
import type { InvoiceChartData, InvoiceChartTypes } from "@finance-platform/types"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
 
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

type cardProps = {
  chartData: InvoiceChartTypes['last6Months'];
  timeRange: keyof InvoiceChartTypes;
  setTimeRange: React.Dispatch<React.SetStateAction<keyof InvoiceChartTypes>>;
}

type chartProps = {
  chartData: InvoiceChartTypes['last6Months'];
}

function RevenueChartCard({chartData, timeRange, setTimeRange}: cardProps){
  const CHART_KEYS = {
    last30Days: {
      label: "30d",
      description: "in the last 30 days",
    },
    last90Days: {
      label: "90d",
      description: "in the last 90 days",
    },
    last6Months: {
      label: "180d",
      description: "in the last 180 days",
    },
    last12Months: {
      label: "365d",
      description: "in the last year",
    },
    allTime: {
      label: "all",
      description: "for all time",
    },
  } satisfies Record<keyof InvoiceChartTypes, {
    label: string,
    description: string,
  }>
  const KEY_LIST = Object.entries(CHART_KEYS);

  function updateTimeRange(value: keyof InvoiceChartTypes){
    if(!value) return; //will have an error without this when clicking a button that's already highlighted, "Toggle Group" shadcn component just sends an empty string as the value in that case.
    setTimeRange(value);
  }

  return(
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          Revenue & Profit
        </CardTitle>
        <CardDescription>
          Revenue and Profits {CHART_KEYS[timeRange].description}.
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={updateTimeRange}
            variant="outline"
            className="hidden lg:flex"
          >
            {KEY_LIST.map((key) => {
              return (
                <ToggleGroupItem value={key[0]} key={key[0]}>{key[1].label}</ToggleGroupItem>
              )
            })}
          </ToggleGroup>
          <Select value={timeRange} onValueChange={updateTimeRange}>
            <SelectTrigger
              className="flex w-40 lg:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder={KEY_LIST[0][1].label}/>
            </SelectTrigger>
            <SelectContent className="rounded-xl">

              {KEY_LIST.map((key) => {
              return (
                <SelectItem className="rounded-lg" value={key[0]} key={key[0]}>{key[1].label}</SelectItem>
              )
            })}
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent>
        <RevenueChart chartData={chartData}></RevenueChart>
      </CardContent>
    </Card>
  )
}



function RevenueChart({chartData}: chartProps) {

  if(chartData.length == 0){
    return(
      <div className="h-[350px] w-full flex justify-center items-center">
        <p className="text-muted-foreground">No data</p>
      </div>
    )
  }

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

export default RevenueChartCard