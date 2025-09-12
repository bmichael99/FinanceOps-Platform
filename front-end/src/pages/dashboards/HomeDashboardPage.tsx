import useFetchPrivate from '@/hooks/useFetchPrivate'
import React, { useEffect } from 'react'

function HomeDashboardPage() {
  const fetchPrivate = useFetchPrivate();

  useEffect(() => {
    async function getUsers(){
      const response = await fetchPrivate("/users","GET");
      console.log("get Users: ", await response.json());
    }
    getUsers();
  },[])





  return (
    <div>HomeDashboardPage</div>
  )
}

export default HomeDashboardPage