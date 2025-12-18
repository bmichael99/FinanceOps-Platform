import useFetchPrivate from '@/hooks/useFetchPrivate'
import React from 'react'
import { type FileStatusType, type Invoice } from '@finance-platform/types';

type Props = {
  abortController?: AbortController, 
  since?: string,
  dueSince?: string,
  dueBefore?: string,
  paymentStatus?: Invoice['paymentStatus'],
  status?: FileStatusType,
  verified?: Invoice['verificationStatus'],
  view?: "SUMMARY" | "FULL" | "CUSTOM",
  fields?: (keyof Invoice)[]
}

/**
 * Query Parameter options: 
 * since: Date object that's received as a string, returns all invoices greater than or equal to the date time provided. ex: ?since=new Date(Date.now() - 1000*60*60*24) will return invoices within the last 24 hours
 * dueSince: same as since but for DueDate instead of createdAt
 * dueBefore: same as dueSince but lte instead of gte
 * status: currentProcessingStatus filter, this is defined by the FileStatusType in the shared types. Current options are: UPLOADING, PENDING, PROCESSING, SAVING, COMPLETED, FAILED
 * view: sets the shape of the return data, determining what data is returned. Current options are summary: returns invoices as FileResponseType[] (shared type which includes fileName, originalFileName, status, and uploadTime(createdAt)). full: returns invoices as Invoice[] (all data returned by db, the full model for invoice). custom: returns the specified fields in fields query param only.
 * fields: Input as comma seperated values. If view type is set to custom then this endpoint will only return the specified fields. Possible fields reflect the prisma model. ex: ?fields=originalFileName,fileName,mimeType
 * verified: whether the invoice has been verified by a user or not through the verify UI.
 */ 
function useGetManyInvoices() {
  const fetchPrivate = useFetchPrivate();

  async function getManyInvoices({abortController, dueSince, dueBefore, since, paymentStatus, status, verified, view, fields}: Props){
    const params = new URLSearchParams();
    if (since !== undefined) params.set("since", since);
    if (dueSince !== undefined) params.set("dueSince", dueSince);
    if (dueBefore !== undefined) params.set("dueBefore", dueBefore);
    if (paymentStatus !== undefined) params.set("paymentStatus", paymentStatus);
    if (status !== undefined) params.set("status", status);
    if (verified !== undefined) params.set("verified", String(verified));
    if (view !== undefined) params.set("view", view);
    if (fields !== undefined) params.set("fields", fields.join(","));
    
    console.log(params.toString());
    const response = fetchPrivate({endpoint: `/invoices?${params.toString()}`, method: "GET", abortController})
    return response;
  }

  return getManyInvoices;
}

export default useGetManyInvoices