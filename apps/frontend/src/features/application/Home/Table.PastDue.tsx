import type { InvoiceTableData } from '@finance-platform/types'
import React from 'react'
import { useBrowseInvoiceColumns } from '@/features/invoices/Browse/BrowseInvoiceColumns';
import BrowseInvoiceDataTable from '@/features/invoices/Browse/BrowseInvoiceDataTable';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

type Props = {
  invoiceTableData: InvoiceTableData[],
  columns: any,
}

function PastDueTable({invoiceTableData, columns}: Props) {

  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          Revenue & Profit
        </CardTitle>
        <CardDescription>
          Revenue and Profits in the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BrowseInvoiceDataTable columns={columns} data={invoiceTableData}></BrowseInvoiceDataTable>
      </CardContent>
    </Card>
    
  )
}

export default PastDueTable