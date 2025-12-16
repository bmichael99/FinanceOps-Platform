import React, { useEffect, useState } from 'react'

import useFetchPrivate from '@/hooks/useFetchPrivate'
import { useNavigate } from 'react-router-dom'
import EmptyTemplate from './EmptyTemplate';
import { type InvoiceDashboardSummaryType } from '@finance-platform/types';
import { Skeleton } from '@/components/ui/skeleton';
import UpcomingInvoices from './Card.UpcomingInvoices';
import TotalRevenue from './Card.TotalRevenue';
import PastDue from './Card.PastDue';
import TotalProfit from './Card.TotalProfit';
import RevenueChart from './Chart.Revenue';
import ProfitChart from './Chart.Profit';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {}

function HomePage({}: Props) {
  const fetchPrivate = useFetchPrivate();
  const [loadingInvoiceSummary, setLoadingInvoiceSummary] = useState(true);
  const [invoiceSummaryData, setInvoiceSummaryData] = useState<InvoiceDashboardSummaryType | null>(null);

  useEffect(() => {
    async function getInvoiceSummary(){
      setLoadingInvoiceSummary(true);
      const response = await fetchPrivate({endpoint: "/invoices/dashboard/summary", method: "GET"});
      if(!response.ok){
        setLoadingInvoiceSummary(false);
        return;
      } 
      const responseData: InvoiceDashboardSummaryType = await response.json();
      setInvoiceSummaryData(responseData);
      setLoadingInvoiceSummary(false);
    }
    getInvoiceSummary();
  },[])

  if(loadingInvoiceSummary){
    return(
      <Skeleton></Skeleton>
    )
  } else if(!invoiceSummaryData){
    return(
      <EmptyTemplate 
      title='No Invoices Yet'
      description='You have no stored invoices. Get started by uploading or creating your first invoice.'
      leftButton={{content: "Upload Invoice", url:"invoices/upload"}}
      rightButton={{content: "Create Invoice", url:"invoices/create"}}
      />
    )
  } else if(invoiceSummaryData.totalInvoices.verified === 0){
    return(
      <EmptyTemplate 
      title='Invoices must be verified'
      description='Invoices must be verified to ensure that your data is correct, but dont worry! Our data exctraction models do most of the work for you.'
      leftButton={{content: "Verify Invoice", url:"invoices/verify"}}
      rightButton={{content: "Create Invoice", url:"invoices/create"}}
      />
    )
  }
  
  return (
    <div className='flex justify-center w-full'>
      <div className='my-4 flex justify-center w-full max-w-7xl flex-col gap-8'>
        {/*There is some weird interaction here where the grid container doesn't like when I set a max width on it, so we need 3 total containers.*/}
        <div className='w-full grid auto-rows-fr grid-auto-fit-home gap-4'>
          <UpcomingInvoices upcoming={invoiceSummaryData.upcoming}/>
          <PastDue pastDue={invoiceSummaryData.past}/>
          <TotalRevenue revenue={invoiceSummaryData.revenue}/>
          <TotalProfit profit={invoiceSummaryData.profit}/>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>
              Revenue & Profit
            </CardTitle>
            <CardDescription>
              Revenue and Profits in the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart chartData={invoiceSummaryData.chartData.last6Months}></RevenueChart>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Revenue vs Expenses
            </CardTitle>
            <CardDescription>
              Revenue vs Expenses in the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfitChart chartData={invoiceSummaryData.chartData.last6Months}></ProfitChart>
          </CardContent>
        </Card>
        
        
      </div>
    </div>
  )
}

export default HomePage