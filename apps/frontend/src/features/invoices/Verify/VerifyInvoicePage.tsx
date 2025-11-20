import useFetchPrivate from '@/hooks/useFetchPrivate'
import React, { useEffect, useState } from 'react'
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import { type FileStatusType } from '@finance-platform/types'
import VerifyInvoiceForm from './VerifyInvoiceForm'
import VerifyInvoiceDisplayFile from './VerifyInvoiceDisplayFile'

type Props = {}

type GetUnprocessedInvoiceNamesResponseType = {
  fileName: string,
  originalFileName: string,
  status: FileStatusType,
}

function VerifyInvoicePage({}: Props) {
  const [invoiceList, setInvoiceList] = useState<GetUnprocessedInvoiceNamesResponseType[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>();
  const fetchPrivate = useFetchPrivate();
  useEffect(() => {
    async function getUnprocessedInvoiceNames(){
      const view = "CUSTOM";
      const fields = "mimeType,originalFileName,fileName";
      const status = "COMPLETED"
      const response = await fetchPrivate({endpoint: `/unprocessed-invoices?view=${view}&fields=${fields}&status=${status}`, method: "GET"});
      const data = await response.json();
      setInvoiceList(data);
    }
    getUnprocessedInvoiceNames();
  },[])

  function handleInvoiceSelect(invoiceId : string) {
    setSelectedFile(invoiceId);
  }

  return (
  <div className='flex flex-col items-center h-svh'>
    <div className='my-2'>
      <NativeSelect onChange={(e) => handleInvoiceSelect(e.target.value)}>
        <NativeSelectOption value="">Select Invoice</NativeSelectOption>
        {invoiceList.map(invoice => <NativeSelectOption key={invoice.fileName} value={invoice.fileName}>{invoice.originalFileName}</NativeSelectOption>)}
      </NativeSelect>
    </div>
    <div className='grid grid-cols-2 mb-2 w-full h-full'>
      <VerifyInvoiceForm invoiceId={selectedFile}></VerifyInvoiceForm>
      <VerifyInvoiceDisplayFile invoiceId={selectedFile}></VerifyInvoiceDisplayFile>
    </div>
  </div>
  )
}

export default VerifyInvoicePage