import * as db from "../repositories/userRepository.js"
import bcrypt from "bcryptjs"
import * as utils from "../utils/jwtUtil.js";
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
dotenv.config();

export const registerUserPost = async (req : Request, res : Response, next : NextFunction) => {
  try{
    
    const password : string = await bcrypt.hash(req.body.password, 10);
    const user = await db.createUser({firstName : req.body.firstName, username : req.body.username, password});
    
    const jwt = utils.issueJWT(user);
    //const hashedRefreshToken = await bcrypt.hash(jwt.refreshToken, 10);

    //save refresh token to DB for current user
    await db.updateUserRefreshToken(jwt.refreshToken,user.id);

    //send access token to client
    res.cookie('jwt', jwt.refreshToken, {httpOnly: true, sameSite: "none", secure: true, maxAge: 30 * 24 * 60 * 60 * 1000});
    res.status(200).json({success: true, user: {id: user.id, username: user.username}, accessToken: jwt.accessToken, accessExpiresIn: jwt.accessExpires});
  }
  catch(err){
    return next(err);
  }
};

export const logInUserPost = async (req : Request, res : Response, next : NextFunction) => {
  try{
    const user = await db.getUserByUsername(req.body.username);
    if(!user){
      return res.status(401).json({success:false, msg: "Could not find user"});
    }

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      // passwords do not match!
      res.status(401).json({success:false, msg: "Incorrect password"});
    }else{
      const jwt = utils.issueJWT(user);
      //const hashedRefreshToken = await bcrypt.hash(jwt.refreshToken, 10);

      //save refresh token to DB for current user
      await db.updateUserRefreshToken(jwt.refreshToken,user.id);

      //send access token to client
      res.cookie('jwt', jwt.refreshToken, {httpOnly: true, sameSite: 'none', secure: true, maxAge: 30 * 24 * 60 * 60 * 1000});
      res.status(200).json({success: true, user: {id: user.id, username: user.username}, accessToken: jwt.accessToken, accessExpiresIn: jwt.accessExpires});
    
    }
  } catch(err){
    next(err);
  }

};

export const handleLogout = async (req : Request, res : Response) => {
  //on client, also delete the accessToken.
  const cookies = req.cookies;

  //check for jwt cookie that we saved in http-only
  if(!cookies?.jwt){
    res.status(204).json({success:true, msg: "no content, cookie cleared."}); //no content, successful
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
    console.log(err);
  }
  
};
