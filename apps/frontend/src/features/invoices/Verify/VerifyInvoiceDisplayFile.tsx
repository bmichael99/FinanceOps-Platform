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
      const response = await fetchPrivate({endpoint: `/invoices/${invoiceId}/signed-url`, method: "GET", abortController: controller})
      if(response.ok){
        const data : getSignedURLResponseType = await response.json();
        setSignedURL(data.signedURL);
        setLoadingSignedURL(false);
        console.log(data);
      } else {
        console.error("yo");
      }
    }

    fetchSignedURL();
    return(() => {
      controller.abort();
    })
  }, [invoiceId])

  return (
  <div className='min-h-svh xl:min-h-0 border-1'>
    {loadingSignedURL ?
    <Skeleton className='h-full w-full'></Skeleton> :
    <iframe src={signedURL} className='min-w-full h-full'></iframe>
    }
  </div>
  )
}

export default VerifyInvoiceDisplayFile