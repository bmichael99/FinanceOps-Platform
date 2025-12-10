import React from 'react'
import {type InvoiceDashboardSummaryType} from "@finance-platform/types"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type Props = {
  revenue: InvoiceDashboardSummaryType['revenue'],
}

function TotalRevenue({revenue}: Props) {
  console.log(revenue);
  const formattedRevenuesList = Object.entries(revenue).map(([key, value]) => {
    const newAmount = value && new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value.amount)

    const newOwed = value && new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value.amountOwed)
    
    const newValue = {amount: newAmount, amountOwed: newOwed}
    
    return [key,newValue];
  })
  const formattedRevenues: InvoiceDashboardSummaryType['revenue'] = Object.fromEntries(formattedRevenuesList);

  return (
    <Card className='border-l-4 border-l-blue-600'>
      <CardHeader>
        <CardTitle className='font-medium'>
          Revenue <span className='text-muted-foreground text-sm font-normal'>(MTD)</span>
        </CardTitle>
        <CardTitle className='flex items-baseline gap-2'>
          <span className='text-4xl'>{formattedRevenues.MTD.amount}</span>
          {/* <span className='text-muted-foreground text-sm font-normal'>invoice{upcoming.next30days.count !== 1 && 's'}</span> */}
        </CardTitle>
        <CardAction>
          <Button variant={'link'}>View</Button>
        </CardAction>
      </CardHeader>
      <CardContent className='flex flex-col'>
        {/*TODO: Add tool tip to explain what projected total is. It includes unpaid receivables.*/}
        <span className='text-muted-foreground text-sm font-normal'>Projected Total</span>
        <span className='text-blue-600'>{formattedRevenues.MTD.amount}</span> 
        {/* <span className='text-muted-foreground text-sm font-normal'>due in the next 30 days</span> */}
        {/* <MySelect /> */}
      </CardContent>
    </Card>
  )
}

export default TotalRevenue