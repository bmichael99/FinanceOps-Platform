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
  const fetchPrivate = useFetchPrivate();
  useEffect(() => {
    const controller = new AbortController();
    async function fetchSignedURL() {
      const response = await fetchPrivate({endpoint: `/unprocessed-invoices/${invoiceId}/signed-url`, method: "GET", abortController: controller})
      const data : getSignedURLResponseType = await response.json();
      setSignedURL(data.signedURL);
      console.log(data);
    }

    fetchSignedURL();
    return(() => {
      controller.abort();
    })
  }, [invoiceId])

  return (
    signedURL &&
    <iframe src={signedURL} className='min-w-full h-full'>

    </iframe>
  )
}

export default VerifyInvoiceDisplayFile