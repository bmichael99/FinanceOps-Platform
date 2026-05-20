import React, { createContext, useState } from 'react'

type Context = {
  verifyCount: number,
  setVerifyCount: React.Dispatch<React.SetStateAction<number>>,
}

export const VerifyCountContext = createContext<Context | null>(null);

function VerifyCountProvider({ children }: {children: React.ReactNode}) {
  const [verifyCount, setVerifyCount] = useState(0);

  return (
    <VerifyCountContext.Provider value={{verifyCount, setVerifyCount}}>
      {children}
    </VerifyCountContext.Provider>
  )
}

export default VerifyCountProvider