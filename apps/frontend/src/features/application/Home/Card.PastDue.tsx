import React from 'react'
import {type InvoiceDashboardSummaryType} from "@finance-platform/types"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type Props = {
  pastDue: InvoiceDashboardSummaryType['past']
}

function PastDue({pastDue}: Props) {
  const formatted = pastDue.amountDue && new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(pastDue.amountDue)
  return (
    <Card className='w-[300px] border-l-4 border-l-red-600'>
      <CardHeader>
        <CardTitle className='font-medium'>
          Past Due
        </CardTitle>
        <CardTitle className='flex items-baseline gap-2'>
          <span className='text-4xl'>{pastDue.count}</span> <span className='text-muted-foreground text-sm font-normal'>invoice{pastDue.count !== 1 && 's'}</span>
        </CardTitle>
        <CardAction>
          <Button variant={'link'}>View</Button>
        </CardAction>
      </CardHeader>
      <CardContent className='flex flex-col gap-1'>
        <div className='flex items-center gap-2'>
          <span className='font-normal text-red-600'>{formatted}</span> <span className='text-sm text-red-600'>overdue</span>
        </div>
        <span className='text-muted-foreground text-sm'>Oldest: 45 days overdue</span>
      </CardContent>

    </Card>
  )
}

export default PastDue