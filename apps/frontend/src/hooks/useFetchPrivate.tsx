import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import { useCallback } from 'react';
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const useFetchPrivate = () => {
  const {auth, setAuth} = useAuth();
  const refresh = useRefreshToken();
  const navigate = useNavigate();

  const fetchPrivate = useCallback(async (endpoint : string, method : string, bodyData ?: BodyInit | null, content_type ?: string)=> {
    const makeRequest = async (token : string) => {
      const headers : HeadersInit | undefined = {
        'Authorization' : token,
      }

      if(content_type && !(bodyData instanceof FormData)){
        headers["Content-Type"] = content_type;
      }


      return await fetch(API_URL + endpoint, {
        method: method,
        headers: headers,
        body: bodyData,
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