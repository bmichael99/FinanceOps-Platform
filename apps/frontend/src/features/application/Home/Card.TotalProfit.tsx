import React from 'react'
import {type InvoiceDashboardSummaryType} from "@finance-platform/types"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type Props = {
  profit: InvoiceDashboardSummaryType['profit'],
}

function TotalProfit({profit}: Props) {
    const formattedProfitsList = Object.entries(profit).map(([key, value]) => {
      const newAmount = value && new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(value.amount)
  
      const newProjected = value && new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(value.projected)
      
      const newValue = {amount: newAmount, projected: newProjected}
      
      return [key,newValue];
    })
    const formattedProfits: InvoiceDashboardSummaryType['revenue'] = Object.fromEntries(formattedProfitsList);

  return (
    <Card className='border-l-4 border-l-green-600'>
      <CardHeader>
        <CardTitle className='font-medium'>
          Profit <span className='text-muted-foreground text-sm font-normal'>(MTD)</span>
        </CardTitle>
        <CardTitle className='flex items-baseline gap-2'>
          <span className='text-4xl'>{formattedProfits.MTD.amount}</span>
          {/* <span className='text-muted-foreground text-sm font-normal'>invoice{upcoming.next30days.count !== 1 && 's'}</span> */}
        </CardTitle>
        <CardAction>
          <Button variant={'link'}>View</Button>
        </CardAction>
      </CardHeader>
      <CardContent className='flex flex-col'>
        {/*TODO: Add tool tip to explain what projected total is. It includes unpaid receivables.*/}
        <span className='text-muted-foreground text-sm font-normal'>Projected Total</span>
        <span className={`${profit.MTD.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>{formattedProfits.MTD.amount}</span> 
        {/* <span className='text-muted-foreground text-sm font-normal'>due in the next 30 days</span> */}
        {/* <MySelect /> */}
      </CardContent>
    </Card>
  )
}

export default TotalProfit