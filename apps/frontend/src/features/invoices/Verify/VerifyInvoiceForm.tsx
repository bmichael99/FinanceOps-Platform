import useFetchPrivate from '@/hooks/useFetchPrivate';
import React, { useEffect, useState } from 'react'
import {type UnprocessedInvoice} from "@finance-platform/types"

type Props = {
  invoiceId: string | undefined
}

function VerifyInvoiceForm({invoiceId}: Props) {
  const [invoiceData, setInvoiceData] = useState<UnprocessedInvoice>();
  const [invoiceTotal, setInvoiceTotal] = useState<string>();
  const fetchPrivate = useFetchPrivate();
  useEffect(() => {
    if(invoiceId){
      
      const controller = new AbortController();
      async function getUnprocessedInvoiceData() {
        const response = await fetchPrivate({endpoint: `/unprocessed-invoices/${invoiceId}`, method: "GET", abortController: controller});
        const data: UnprocessedInvoice = await response.json();
        setInvoiceData(data);
        console.log(data);
      }

      getUnprocessedInvoiceData();
      return(() => {
        controller.abort();
      })
    }
  }, [invoiceId])
  return (
    <div>
      <form action="">
        <div className='flex flex-col items-center'>
          <label htmlFor="invoice-total">Invoice Total</label>
          <input name="invoice-total" type="text" id="invoice-total" onChange={(e) => setInvoiceTotal(e.target.value)}/>
        </div>
        {invoiceTotal}
      </form>
    </div>
  )
}

export default VerifyInvoiceForm