import React, { useContext } from 'react'
import { VerifyCountContext } from '@/context/VerifyCountProvider'

function useVerifyCount() {
  const context = useContext(VerifyCountContext);

  if(!context){
    throw new Error("useVerifyCount must be used within an AuthProvider");
  }

  return context;
}

export default useVerifyCount