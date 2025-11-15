import useFetchPrivate from '@/hooks/useFetchPrivate'
import React, { useEffect, useState } from 'react'

type Props = {}

function VerifyInvoicePage({}: Props) {
  const [invoiceName, setInvoiceName] = useState<string[]>([]);
  const fetchPrivate = useFetchPrivate();
  useEffect(() => {

    async function getUnprocessedInvoiceNames(){
      const view = "CUSTOM";
      const fields = "mimeType,originalFileName,fileName";
      const response = await fetchPrivate({endpoint: `/unprocessed-invoices?view=${view}&fields=${fields}`, method: "GET"});
      const data = await response.json();
      console.log(data);

    }

    getUnprocessedInvoiceNames();

  },[])


  return (
    <div>VerifyInvoicePage</div>
  )
}

export default VerifyInvoicePage