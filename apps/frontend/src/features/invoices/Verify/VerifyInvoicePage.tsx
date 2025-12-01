import useFetchPrivate from '@/hooks/useFetchPrivate'
import React, { useEffect, useState } from 'react'
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import { type FileStatusType, type Invoice } from '@finance-platform/types'
import VerifyInvoiceForm from './VerifyInvoiceForm'
import VerifyInvoiceDisplayFile from './VerifyInvoiceDisplayFile'
import { Spinner } from '@/components/ui/spinner'
import { useNavigate } from 'react-router-dom'
import type { InvoiceFormType } from '@finance-platform/schemas'

type Props = {}

type GetInvoiceNamesResponseType = {
  fileName: string,
  originalFileName: string,
  status: FileStatusType,
}

function VerifyInvoicePage({}: Props) {
  const [invoiceList, setInvoiceList] = useState<GetInvoiceNamesResponseType[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>();
  const [invoiceData, setInvoiceData] = useState<Invoice>();
  const [loadingInvoiceData, setLoadingInvoiceData] = useState<boolean>(true);
  const [loadingInvoiceList, setLoadingInvoiceList] = useState<boolean>(true);
  const fetchPrivate = useFetchPrivate();
  const navigate = useNavigate();
  //fetch a list of completed invoices
  useEffect(() => {
    async function getInvoiceNames(){
      setLoadingInvoiceList(true);
      const view = "CUSTOM";
      const fields = "mimeType,originalFileName,fileName";
      const status = "COMPLETED";
      const verified = false;
      const response = await fetchPrivate({endpoint: `/invoices?view=${view}&fields=${fields}&status=${status}&verified=${verified}`, method: "GET"});
      const data = await response.json();
      setInvoiceList(data);
      setLoadingInvoiceList(false);
    }
    getInvoiceNames();
  },[])

  useEffect(() => {
    if(!selectedFile) return;

    setLoadingInvoiceData(true);
    const controller = new AbortController();
    async function getInvoiceData() {
      const response = await fetchPrivate({endpoint: `/invoices/${selectedFile}`, method: "GET", abortController: controller});
      const data: Invoice = await response.json();
      setInvoiceData(data);
      setLoadingInvoiceData(false);
    }
    getInvoiceData();
    return(() => {
      controller.abort();
    })
  },[selectedFile])

  function handleInvoiceSelect(invoiceId : string) {
    setSelectedFile(invoiceId);
  }

  async function submitForm(data: InvoiceFormType, invoiceId: string){
    const response = await fetchPrivate({endpoint: `/invoices/${invoiceId}/verify`, method: "POST", bodyData: JSON.stringify(data), content_type: "application/json"}); //
    console.log(await response.json());
    if (response.status == 200){
      navigate(0);
    }
  }

  return (
  <div className='flex flex-col items-center h-svh'>
    <div className='my-4 flex items-center gap-2'>
      {loadingInvoiceList && <Spinner></Spinner>}
      <NativeSelect onChange={(e) => handleInvoiceSelect(e.target.value)}>
        <NativeSelectOption value="">{loadingInvoiceList ? "Loading.." : "Select Invoice"}</NativeSelectOption>
        {invoiceList.map(invoice => <NativeSelectOption key={invoice.fileName} value={invoice.fileName}>{invoice.originalFileName}</NativeSelectOption>)}
      </NativeSelect>
    </div>
    <div className='grid grid-cols-1 xl:grid-cols-2 mb-4 w-full h-full gap-4'>
      {selectedFile && ((loadingInvoiceData || !invoiceData) 
      ? 
      <div className='flex justify-center items-center gap-2'><Spinner/><p>Loading form data...</p></div> 
      :
      <VerifyInvoiceForm invoiceId={selectedFile} invoiceData={invoiceData} onSubmit={submitForm}></VerifyInvoiceForm>)}
      {selectedFile && <VerifyInvoiceDisplayFile invoiceId={selectedFile}></VerifyInvoiceDisplayFile>}
    </div>
  </div>
  )
}

export default VerifyInvoicePage