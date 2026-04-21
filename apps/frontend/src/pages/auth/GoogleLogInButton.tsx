import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
type Props = {
  loginContext: "LogIn" | "SignUp"
}


function GoogleLogInButton({loginContext}: Props) {
  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const API_URL = import.meta.env.VITE_API_URL;

  return (
    <>
      <div id="g_id_onload"
        data-client_id={`${CLIENT_ID}.apps.googleusercontent.com`}
        data-context={loginContext == "LogIn" ? "signin" : "signup"}
        data-ux_mode="popup"
        data-login_uri={`${API_URL}/auth/google/receiver`}
        data-auto_prompt="false">
    </div>

    <div className="g_id_signin"
        data-type="standard"
        data-shape="rectangular"
        data-theme="outline"
        data-text={loginContext == "LogIn" ? "signin_with" : "signup_with"}
        data-size="medium"
        data-logo_alignment="left">
    </div>
    </>
  )
}

export default GoogleLogInButton