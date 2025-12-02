import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

type Props = {}

function UpcomingInvoices({}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Upcoming Invoices
        </CardTitle>
        <CardDescription>
          Invoices due within the next 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        
      </CardContent>
    </Card>
  )
}

export default UpcomingInvoices