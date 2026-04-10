import React from 'react'

type Props = {}

function GoogleLogInButton({}: Props) {
  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  function onSignIn(){
    console.log("yooo....");
  }
  return (
    <>
      <div id="g_id_onload"
        data-client_id={`${CLIENT_ID}.apps.googleusercontent.com`}
        data-context="signin"
        data-ux_mode="popup"
        data-callback="onSignIn"
        data-auto_prompt="false">
    </div>

    <div className="g_id_signin"
        data-type="standard"
        data-shape="rectangular"
        data-theme="outline"
        data-text="signin_with"
        data-size="medium"
        data-logo_alignment="left">
    </div>
    </>
  )
}

export default GoogleLogInButton