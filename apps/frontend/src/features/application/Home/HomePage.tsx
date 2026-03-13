import React, { useEffect, useState } from 'react'

import useFetchPrivate from '@/hooks/useFetchPrivate'
import { useNavigate } from 'react-router-dom'
import EmptyTemplate from './EmptyTemplate';
import { type InvoiceChartTypes, type InvoiceDashboardSummaryType, type InvoiceTableData } from '@finance-platform/types';
import { Skeleton } from '@/components/ui/skeleton';
import UpcomingInvoices from './Card.UpcomingInvoices';
import TotalRevenue from './Card.TotalRevenue';
import PastDue from './Card.PastDue';
import TotalProfit from './Card.TotalProfit';
import RevenueChart from './Chart.Revenue';
import ProfitChart from './Chart.Profit';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BrowseInvoiceDataTable from '@/features/invoices/Browse/BrowseInvoiceDataTable';
import useGetManyInvoices from '@/api/useGetManyInvoices';
import { useBrowseInvoiceColumns } from '@/features/invoices/Browse/BrowseInvoiceColumns';
import PastDueTable from './Table.PastDue';
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group"
import { Button } from '@/components/ui/button';

type Props = {}

function HomePage({}: Props) {
  const fetchPrivate = useFetchPrivate();
  const getManyInvoices = useGetManyInvoices();
  const [loadingInvoiceSummary, setLoadingInvoiceSummary] = useState(true);
  const [invoiceSummaryData, setInvoiceSummaryData] = useState<InvoiceDashboardSummaryType | null>(null);
  const [loadingInvoiceTableData, setloadingInvoiceTableData] = useState(true);
  const [invoiceTableData, setInvoiceTableData] = useState<InvoiceTableData[]>();
  const [timeRange, setTimeRange] = useState<keyof InvoiceChartTypes>("last30Days");
  const columns = useBrowseInvoiceColumns({setInvoiceTableData});

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

  useEffect(() => {
    async function getInvoiceTableData(){
      setloadingInvoiceTableData(true);
      const response = await getManyInvoices({paymentStatus: 'UNPAID',dueBefore: new Date().toDateString(), status:'COMPLETED', verified: 'VERIFIED', view: 'CUSTOM', fields: ["fileName","originalFileName","InvoiceDate","InvoiceTotal","InvoiceId","DueDate"]})
      if(!response.ok){
        setloadingInvoiceTableData(false);
        return;
      }
      const responseData: InvoiceTableData[] = await response.json();
      setInvoiceTableData(responseData);
      setloadingInvoiceTableData(false);
    }
    getInvoiceTableData();
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
        
        {/* <div className='w-full flex justify-end'>
        <ButtonGroup>
          <Button variant={'outline'}>30d</Button>
          <Button variant={'outline'}>90d</Button>
          <Button variant={'outline'}>365d</Button>
          <Button variant={'outline'}>all</Button>
        </ButtonGroup>
        </div> */}

        <div className='w-full grid auto-rows-fr grid-auto-fit-home gap-4'>
          <UpcomingInvoices upcoming={invoiceSummaryData.upcoming}/>
          <PastDue pastDue={invoiceSummaryData.past}/>
          <TotalRevenue revenue={invoiceSummaryData.revenue}/>
          <TotalProfit profit={invoiceSummaryData.profit}/>
        </div>


        <RevenueChart chartData={invoiceSummaryData.chartData[timeRange]} timeRange={timeRange} setTimeRange={setTimeRange}></RevenueChart>
        <ProfitChart chartData={invoiceSummaryData.chartData[timeRange]}></ProfitChart>
        {loadingInvoiceTableData
       ? <Skeleton></Skeleton> 
       : (invoiceTableData && <PastDueTable columns={columns} invoiceTableData={invoiceTableData}></PastDueTable>)
        }
        
      </div>
    </div>
  )
}

export default HomePage