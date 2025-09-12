import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import { useCallback } from 'react';
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const useFetchPrivate = () => {
  const {auth, setAuth} = useAuth();
  const refresh = useRefreshToken();
  const navigate = useNavigate();

  const fetchPrivate = useCallback(async (endpoint : string, method : string, bodyData ?: object)=> {
    const makeRequest = async (token : string) => {
      return await fetch(API_URL + endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify(bodyData),
      });
    };

    let response = await makeRequest(auth.accessToken);

    //if unauthorized, attempt to refresh accessToken by sending stored refreshToken
    try{
      if(response.status === 401){
        const newAccessToken = await refresh();
        setAuth({...auth, accessToken: newAccessToken});
        
        response = await makeRequest(newAccessToken);

        if(response.status === 401){
          throw new Error("Session expired");
        }

      }
    } catch(err){
      console.error("Refresh failed or still unauthorized:", err);
      setAuth({});
      navigate('/log-in');
      throw err;
    }

    return response;
  }, [auth.accessToken, refresh, setAuth]);

  return fetchPrivate;
}

export default useFetchPrivate;