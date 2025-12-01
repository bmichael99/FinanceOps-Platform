import useFetchPrivate from '@/hooks/useFetchPrivate';
import type { Invoice } from '@finance-platform/types';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router";
import VerifyInvoiceForm from '../Verify/VerifyInvoiceForm';
import { Spinner } from '@/components/ui/spinner';
import type { InvoiceFormType } from '@finance-platform/schemas';
import VerifyInvoiceDisplayFile from '../Verify/VerifyInvoiceDisplayFile';
import { toast } from 'sonner';

type Props = {}

function ViewInvoicePage({}: Props) {
  const {invoiceId} = useParams();
  const [invoiceData, setInvoiceData] = useState<Invoice>();
  const [loadingInvoiceData, setLoadingInvoiceData] = useState(true);
  const fetchPrivate = useFetchPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    async function getInvoiceData(){
      setLoadingInvoiceData(true);
      const verified = true;
      const response = await fetchPrivate({endpoint: `/invoices/${invoiceId}?verified=${verified}`, method:"GET"});
      if(response.ok){
        const data = await response.json();
        setInvoiceData(data);
        setLoadingInvoiceData(false);
      } else {
        navigate("/");
      }
    }

    getInvoiceData();
  },[])

  async function submitForm(data: InvoiceFormType, invoiceId: string){
    const response = await fetchPrivate({endpoint: `/invoices/${invoiceId}/verify`, method: "POST", bodyData: JSON.stringify(data), content_type: "application/json"}); //
    console.log(await response.json());
    if (response.status == 200){
      navigate(0);
    }
  }

  async function deleteInvoice(invoice: Invoice){
    if(!window.confirm(`Are you sure you want to delete Invoice ${invoice.originalFileName} with ID ${invoice.InvoiceId}?`))
      return;
    //optimistic UI update with restoration on API failure.
    const {fileName} = invoice;

    const response = await fetchPrivate({endpoint:`/invoices/${fileName}`, method:"delete"});
    if(response.ok){
      navigate("/dashboard/invoices/browse");
    } else {
      toast.error("Failed to delete invoice. Please try again later.");
    }
  }
  
  return (
    <div className='min-h-svh py-4 grid grid-cols-1 xl:grid-cols-2 gap-4'>
      {loadingInvoiceData
        ?
        <div className='flex justify-center items-center gap-2'><Spinner/><p>Loading form data...</p></div>
        :
        (invoiceData && invoiceId) && <VerifyInvoiceForm invoiceData={invoiceData} invoiceId={invoiceId} onSubmit={submitForm} onDelete={deleteInvoice}></VerifyInvoiceForm>}
      {invoiceId && <VerifyInvoiceDisplayFile invoiceId={invoiceId}></VerifyInvoiceDisplayFile>}
    </div>
  )
}

export default ViewInvoicePage