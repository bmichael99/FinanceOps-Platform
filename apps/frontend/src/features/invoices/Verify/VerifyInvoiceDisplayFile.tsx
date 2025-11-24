import { Skeleton } from '@/components/ui/skeleton'
import useFetchPrivate from '@/hooks/useFetchPrivate'
import React, { useEffect, useState } from 'react'

type Props = {
  invoiceId: string
}

type getSignedURLResponseType = {
  signedURL: string,
  wasCached: boolean
}

function VerifyInvoiceDisplayFile({invoiceId}: Props) {
  const [signedURL, setSignedURL] = useState<string>();
  const [loadingSignedURL, setLoadingSignedURL] = useState<boolean>(true);
  const fetchPrivate = useFetchPrivate();
  useEffect(() => {
    const controller = new AbortController();
    async function fetchSignedURL() {
      setLoadingSignedURL(true);
      const response = await fetchPrivate({endpoint: `/unprocessed-invoices/${invoiceId}/signed-url`, method: "GET", abortController: controller})
      const data : getSignedURLResponseType = await response.json();
      setSignedURL(data.signedURL);
      setLoadingSignedURL(false);
      console.log(data);
    }

    fetchSignedURL();
    return(() => {
      controller.abort();
    })
  }, [invoiceId])

  return (
  <div>
    {loadingSignedURL ?
    <Skeleton className='h-full w-full'></Skeleton> :
    <iframe src={signedURL} className='min-w-full h-full'></iframe>
    }
  </div>
  )
}

export default VerifyInvoiceDisplayFile