import useAuth from "@/hooks/useAuth";
import useRefreshToken from "@/hooks/useRefreshToken";
import { useEffect, useState } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";

function RequireAuth() {
  const {auth, setAuth} = useAuth();
  const [loading, setLoading] = useState(true);
  const refresh = useRefreshToken();

  useEffect(() => {
    const verifyRefresh = async () => {
      try {
        if (!auth?.accessToken) {
          await refresh();
        }
      } catch (err) {
        console.log("unauthorized");
      } finally {
        setLoading(false);
      }
    };
    
    verifyRefresh();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    auth?.accessToken ? <Outlet /> : <Navigate to="/log-in" replace />
  )
}

export default RequireAuth