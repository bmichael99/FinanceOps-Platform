import useFetchPrivate from '@/hooks/useFetchPrivate';
import type { InvoiceTableData } from '@finance-platform/types';
import React, { useEffect, useState } from 'react'
import BrowseInvoiceDataTable from './BrowseInvoiceDataTable';
import {useBrowseInvoiceColumns} from './BrowseInvoiceColumns'
import { Spinner } from '@/components/ui/spinner';

type Props = {}

function BrowseInvoicePage({}: Props) {
  const [invoiceTableData, setInvoiceTableData] = useState<InvoiceTableData[]>();
  const [loadingInvoiceTableData, setLoadingInvoiceTableData] = useState<boolean>(true);
  const fetchPrivate = useFetchPrivate();
  const columns = useBrowseInvoiceColumns({setInvoiceTableData});
  useEffect(() => {
    const abortController = new AbortController();

    async function getInvoiceTableData(){
      setLoadingInvoiceTableData(true);
      const response = await fetchPrivate({endpoint: "/invoices/table-data", method:"GET", abortController});
      if(response.ok){
        const data:InvoiceTableData[] = await response.json();
        // const formatedData:InvoiceTableData[] = data.map((invoice) => ({...invoice, InvoiceTotal: `$${invoice.InvoiceTotal}`, InvoiceDate: invoice.InvoiceDate ? new Date(invoice.InvoiceDate).toDateString() : null}))
        setInvoiceTableData(data);
        setLoadingInvoiceTableData(false);
        console.log(data);
      }
    }

    getInvoiceTableData();
    
    return(() => {
      abortController.abort();
    })
  },[])
  return (
    <div className='my-4 flex justify-center'>
    <div className='w-full max-w-6xl'>
      {loadingInvoiceTableData ? (<div className='flex justify-center items-center gap-2'><Spinner/><p>Loading invoice data...</p></div>) : (invoiceTableData && <BrowseInvoiceDataTable columns={columns} data={invoiceTableData} />)}
    </div>
    </div>
  )
}

export default BrowseInvoicePage