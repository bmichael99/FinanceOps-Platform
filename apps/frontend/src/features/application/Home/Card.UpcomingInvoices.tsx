import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import {type InvoiceDashboardSummaryType} from "@finance-platform/types"
import { Button } from '@/components/ui/button'
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"

type Props = {
  upcoming: InvoiceDashboardSummaryType['upcoming']
}

function MySelect(){
  return(
  <NativeSelect className=''>
      <NativeSelectOption value="thirtyDays">30 Days</NativeSelectOption>
      <NativeSelectOption value="todo">7 Days</NativeSelectOption>
  </NativeSelect>
  )
}

function UpcomingInvoices({upcoming}: Props) {
  const formatted = upcoming.next30days.amountDue && new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(upcoming.next30days.amountDue)
  return (
    <Card className='w-[300px] border-l-4 border-l-yellow-300'>
      <CardHeader>
        <CardTitle className='font-medium'>
          Upcoming Invoices
        </CardTitle>
        <CardTitle className='flex items-baseline gap-2'>
          <span className='text-4xl'>{upcoming.next30days.count}</span> <span className='text-muted-foreground text-sm font-normal'>invoice{upcoming.next30days.count !== 1 && 's'}</span>
        </CardTitle>
        <CardAction>
          <Button variant={'link'}>View</Button>
        </CardAction>
      </CardHeader>
      <CardContent className='flex items-center gap-2'>
        {formatted} <span className='text-muted-foreground text-sm font-normal'>due in the next 30 days</span>
        {/* <MySelect /> */}
      </CardContent>
    </Card>
  )
}

export default UpcomingInvoices