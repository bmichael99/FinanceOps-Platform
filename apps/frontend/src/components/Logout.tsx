import {useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

const API_URL = import.meta.env.VITE_API_URL;

function Logout() {
  const { setAuth } = useAuth();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const doLogout = async () => {
      try {
        await fetch(API_URL + '/auth/log-out/', {
          method: "GET",
          credentials: "include",
        });
      } catch (err) {
        console.error("Logout failed:", err);
      } finally {
        //clear auth state in memory
        setAuth({});
        setDone(true);
      }
    };

    doLogout();
  }, []);

  if (done) {
    return <Navigate to="/" replace />;
  }

  return <p className='flex items-center justify-center'>Logging out...</p>;
}

export default Logout;