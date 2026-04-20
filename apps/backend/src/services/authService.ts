import googleClient from '../config/google';

export async function verifyGoogleToken(token: string){
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}