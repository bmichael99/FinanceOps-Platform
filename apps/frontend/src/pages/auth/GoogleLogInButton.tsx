import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
type Props = {
  loginContext: "LogIn" | "SignUp"
}


function GoogleLogInButton({loginContext}: Props) {
  const CLIENT_ID = "361356369731-o4btj2ca10ho4nku5rjihf80g9fm6ms3";
  // const API_URL = import.meta.env.VITE_API_URL;

  return (
    <>
      <div id="g_id_onload"
        data-client_id={`${CLIENT_ID}.apps.googleusercontent.com`}
        data-context={loginContext == "LogIn" ? "signin" : "signup"}
        data-ux_mode="popup"
        data-login_uri={`/api/auth/google/receiver`}
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