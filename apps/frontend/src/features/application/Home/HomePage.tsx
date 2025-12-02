import React, { useEffect, useState } from 'react'

import useFetchPrivate from '@/hooks/useFetchPrivate'
import { useNavigate } from 'react-router-dom'
import EmptyTemplate from './EmptyTemplate';
import { type InvoiceDashboardSummaryType } from '@finance-platform/types';
import { Skeleton } from '@/components/ui/skeleton';

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

      console.log("get Invoice Summary: ", await response.json());
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
    <div>

    </div>
  )
}

export default HomePage