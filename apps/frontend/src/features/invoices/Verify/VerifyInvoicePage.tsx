import useFetchPrivate from '@/hooks/useFetchPrivate'
import React, { useEffect, useState } from 'react'
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import { type FileStatusType, type UnprocessedInvoice } from '@finance-platform/types'
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
  const [invoiceData, setInvoiceData] = useState<UnprocessedInvoice>();
  const [loadingInvoiceData, setLoadingInvoiceData] = useState<boolean>(false);
  const fetchPrivate = useFetchPrivate();
  //fetch a list of unprocessed and completed invoices
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

  useEffect(() => {
    if(selectedFile){
      setLoadingInvoiceData(true);
      const controller = new AbortController();
      async function getUnprocessedInvoiceData() {
        const response = await fetchPrivate({endpoint: `/unprocessed-invoices/${selectedFile}`, method: "GET", abortController: controller});
        const data: UnprocessedInvoice = await response.json();
        setInvoiceData(data);
        setLoadingInvoiceData(false);
      }
      getUnprocessedInvoiceData();
      return(() => {
        controller.abort();
      })
    }
  },[selectedFile])

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
    <div className='grid grid-cols-2 mb-2 w-full h-full gap-4'>
      {loadingInvoiceData ? <p>Change to loading skeleton</p> : ((selectedFile && invoiceData) && <VerifyInvoiceForm invoiceId={selectedFile} invoiceData={invoiceData}></VerifyInvoiceForm>)}
      {selectedFile && <VerifyInvoiceDisplayFile invoiceId={selectedFile}></VerifyInvoiceDisplayFile>}
    </div>
  </div>
  )
}

export default VerifyInvoicePage