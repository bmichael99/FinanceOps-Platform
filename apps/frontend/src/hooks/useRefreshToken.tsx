import { useState, useEffect } from 'react';
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const {setAuth} = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const refresh = async () =>{
    const response = await fetch(API_URL + '/refresh/', {
      method: 'GET',
      credentials: 'include'
    });

    const responseData = await response.json();

    setAuth((prev : any) => {
      return {...prev, accessToken: responseData.accessToken}
    })

    return responseData.accessToken;
  }

  return refresh;
}

export default useRefreshToken;