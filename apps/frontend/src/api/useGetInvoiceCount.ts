import useFetchPrivate from '@/hooks/useFetchPrivate'
import React from 'react'
import { type FileStatusType, type Invoice } from '@finance-platform/types';

type Props = {
  abortController?: AbortController, 
  since?: string,
  dueSince?: string,
  dueBefore?: string,
  invoiceType?: Invoice['invoiceType'],
  paymentStatus?: Invoice['paymentStatus'],
  status?: FileStatusType,
  verified?: boolean,
}

/**
 * Query Parameter options: 
 * since: Date object that's received as a string, returns all invoices greater than or equal to the date time provided. ex: ?since=new Date(Date.now() - 1000*60*60*24) will return invoices within the last 24 hours
 * dueSince: same as since but for DueDate instead of createdAt
 * dueBefore: same as dueSince but lte instead of gte
 * status: currentProcessingStatus filter, this is defined by the FileStatusType in the shared types. Current options are: UPLOADING, PENDING, PROCESSING, SAVING, COMPLETED, FAILED
 * verified: whether the invoice has been verified by a user or not through the verify UI.
 */ 
function useGetInvoiceCount() {
  const fetchPrivate = useFetchPrivate();

  async function getInvoiceCount({abortController, dueSince, dueBefore, since, invoiceType, paymentStatus, status, verified}: Props){
    const params = new URLSearchParams();
    if (since !== undefined) params.set("since", since);
    if (dueSince !== undefined) params.set("dueSince", dueSince);
    if (dueBefore !== undefined) params.set("dueBefore", dueBefore);
    if (invoiceType !== undefined && invoiceType !== null) params.set("invoiceType", invoiceType);
    if (paymentStatus !== undefined) params.set("paymentStatus", paymentStatus);
    if (status !== undefined) params.set("status", status);
    if (verified !== undefined) params.set("verified", String(verified));
    
    // console.log(params.toString());
    const response = fetchPrivate({endpoint: `/invoices/count?${params.toString()}`, method: "GET", abortController})
    return response;
  }

  return getInvoiceCount;
}

export default useGetInvoiceCount