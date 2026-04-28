import { useState, useEffect } from 'react';
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const {setAuth} = useAuth();
  // const API_URL = import.meta.env.VITE_API_URL;

  const refresh = async () =>{
    const response = await fetch('/api/refresh/', {
      method: 'GET',
      credentials: 'include'
    });
    if(response.ok){
      const responseData = await response.json();

      setAuth((prev : any) => {
        return {...prev, accessToken: responseData.accessToken}
      })

      return responseData.accessToken;
    }
    return undefined;
  }

  return refresh;
}

export default useRefreshToken;