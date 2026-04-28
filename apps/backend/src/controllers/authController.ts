import * as db from "../repositories/userRepository.js"
import bcrypt from "bcryptjs"
import * as utils from "../utils/jwtUtil.js";
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import z from "zod";
import * as service from "../services/authService.js";
import { Prisma } from '../generated/prisma'
dotenv.config();

export const registerUserPost = async (req : Request, res : Response, next : NextFunction) => {
  try{
    
    const password : string = await bcrypt.hash(req.body.password, 10);
    
    //The unique constraint on the username column will handle if username already exists, 
    //and will throw an error to our error handler if a user tries to use an existing username.
    const user = await db.createUser({firstName : req.body.firstName, username : req.body.username, password});
    
    const jwt = utils.issueJWT(user);

    //save refresh token to DB for current user
    await db.updateUserRefreshToken(jwt.refreshToken,user.id);

    //send refresh and access token to client
    res.cookie('jwt', jwt.refreshToken, {httpOnly: true, sameSite: "none", secure: true, maxAge: 30 * 24 * 60 * 60 * 1000});
    res.status(200).json({success: true, user: {id: user.id, username: user.username}, accessToken: jwt.accessToken, accessExpiresIn: jwt.accessExpires});
  }
  catch(err){
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return res.status(409).json({success: false, msg: 'username already exists'});
    }
    return next(err);
  }
};

export const logInUserPost = async (req : Request, res : Response, next : NextFunction) => {
  try{
    const user = await db.getUserByUsername(req.body.username);
    if(!user){
      return res.status(401).json({success:false, msg: "Could not find user", type: "username"});
    }

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      // passwords do not match!
      res.status(401).json({success:false, msg: "Incorrect password", type: "password"});
    }else{
      const jwt = utils.issueJWT(user);
      //const hashedRefreshToken = await bcrypt.hash(jwt.refreshToken, 10);

      //save refresh token to DB for current user
      await db.updateUserRefreshToken(jwt.refreshToken,user.id);

      //send access and refresh token to client
      res.cookie('jwt', jwt.refreshToken, {httpOnly: true, sameSite: 'none', secure: true, maxAge: 30 * 24 * 60 * 60 * 1000});
      res.status(200).json({success: true, user: {id: user.id, username: user.username}, accessToken: jwt.accessToken, accessExpiresIn: jwt.accessExpires});
    
    }
  } catch(err){
    next(err);
  }

};

export const handleLogout = async (req : Request, res : Response, next: NextFunction) => {
  //on client, also delete the accessToken.
  const cookies = req.cookies;

  //check for jwt cookie that we saved in http-only
  if(!cookies?.jwt){
    return res.status(204).json({success:true, msg: "no content, cookie cleared."}); //no content, successful
  }
  const refreshToken = cookies.jwt;

  //is refreshToken in db?
  try{
    const user = await db.getUserByRefreshToken(refreshToken);
    if(!user){
      res.clearCookie('jwt', {httpOnly: true, sameSite: 'none', secure: true});
      return res.status(204).json({success:true, msg: "no content, cookie cleared."});
    }

    //delete refreshtoken in db
    await db.updateUserDeleteRefreshToken(user.id);
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'none', secure: true});
    res.sendStatus(204);
  } catch(err){
    next(err);
  }
  
};

export const handleGoogleAuth = async (req : Request, res : Response, next: NextFunction) => {
//Request body
const googleRequestBodySchema = z.object({
    credential: z.string(),
    g_csrf_token: z.string(),
})
const googleRequestBodyParseResult = googleRequestBodySchema.safeParse(req.body);
if (!googleRequestBodyParseResult.success){
  return res.status(400).json({message: "Failed to parse the data received.", error: googleRequestBodyParseResult.error});
}
const googleRequestBodyData = googleRequestBodyParseResult.data;
//Request cookies
const googleRequestCookiesSchema = z.object({
    G_ENABLED_IDPS: z.string().optional(),
    g_state: z.string().optional(),
    g_csrf_token: z.string(),
})
const googleRequestCookiesParseResult = googleRequestCookiesSchema.safeParse(req.cookies);
if (!googleRequestCookiesParseResult.success){
  return res.status(400).json({message: "Failed to parse the data received.", error: googleRequestCookiesParseResult.error});
}
const googleRequestCookiesData = googleRequestCookiesParseResult.data;

//Verify extracted csrf tokens match as recommended in google identity documentation
if(googleRequestCookiesData.g_csrf_token !== googleRequestBodyData.g_csrf_token){
  return res.status(400).json({message: "g_csrf_token token mismatch", error: googleRequestCookiesParseResult.error});
}


// console.log("google Data: ", googleRequestBodyData);

// console.log("cookies: " , req.cookies);
try{
  //verify the JWT signature provided by google
  const payload = await service.verifyGoogleToken(googleRequestBodyData.credential);
  if(!payload) return res.sendStatus(400).json({message: "failed to verify JWT token"});
  // This ID is unique to each Google Account, making it suitable for use as a primary key
  // during account lookup. Email is not a good choice because it can be changed by the user.
  const userid = payload['sub'];

  let user = await db.getUserByGoogleId(userid);
  if(!user){ 
    user = await db.createUser({firstName : payload.given_name ?? userid, username : userid, password: crypto.randomUUID(), googleUserId: userid});
  }

    const jwt = utils.issueJWT(user);

    //save refresh token to DB for current user
    await db.updateUserRefreshToken(jwt.refreshToken,user.id);

    //send refresh token to client
    res.cookie('jwt', jwt.refreshToken, {httpOnly: true, sameSite: "none", secure: true, maxAge: 30 * 24 * 60 * 60 * 1000});
    //json({success: true, user: {id: user.id, username: user.username}, accessToken: jwt.accessToken, accessExpiresIn: jwt.accessExpires}).
    res.status(200).redirect(`${process.env.FRONTEND_URL}/dashboard`);
  
    //TODO: **DONE** add google id to schema, index googleId column in database for fast lookups, add helper functions in userRepository, integrate into refresh/access flow.
  //**DONE** If the googleId exists in the database, return federated user: silently sign the user in.
  //**DONE** If it's an unregistered user: we can either show a sign-up user interface or silently create the new account and log in the user
  //If we migrate to use email addresses then we can link existing accounts to attempted google logins, 
    //you can show a web page that allows the end user to input their password and link the legacy account with their Google credentials. 
    //this confirms that the user has access to the existing account.

} catch(err){
  next(err);
}
}
